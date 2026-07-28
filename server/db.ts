import fs from 'fs/promises';
import path from 'path';
import mysql from 'mysql2/promise';

const DATA_DIR = path.join(process.cwd(), 'data');
let mysqlPool: mysql.Pool | null = null;
let useMysql = false;

// Check if MySQL connection is configured
if (
  process.env.DB_TYPE === 'mysql' ||
  process.env.MYSQL_URL ||
  process.env.DATABASE_URL?.startsWith('mysql://') ||
  process.env.MYSQL_HOST ||
  process.env.DB_HOST
) {
  useMysql = true;
}

/**
 * Initializes and returns the MySQL connection pool.
 * Fully optimized with connection limits, timeouts, and SSL support.
 */
export function getMysqlPool(): mysql.Pool {
  if (!mysqlPool) {
    if (!useMysql) {
      throw new Error("MySQL connection requested but database parameters are not configured.");
    }

    const connUri = process.env.MYSQL_URL || 
                    (process.env.DATABASE_URL?.startsWith('mysql://') ? process.env.DATABASE_URL : undefined);
    
    const sslConfig = process.env.MYSQL_SSL === 'true' || process.env.DB_SSL === 'true'
      ? { rejectUnauthorized: false }
      : undefined;

    if (connUri) {
      console.log("[MYSQL DATABASE] Initializing pool via connection URI.");
      mysqlPool = mysql.createPool({
        uri: connUri,
        ssl: sslConfig,
        connectionLimit: 20, // optimized pool size for concurrent client operations
        idleTimeout: 30000,
        connectTimeout: 5000,
      });
    } else {
      console.log("[MYSQL DATABASE] Initializing pool via individual credentials.");
      mysqlPool = mysql.createPool({
        host: process.env.MYSQL_HOST || process.env.DB_HOST || '127.0.0.1',
        user: process.env.MYSQL_USER || process.env.DB_USER || 'root',
        password: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD,
        database: process.env.MYSQL_DATABASE || process.env.DB_NAME,
        port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 3306,
        ssl: sslConfig,
        connectionLimit: 20,
        idleTimeout: 30000,
        connectTimeout: 5000,
      });
    }
  }
  return mysqlPool;
}

/**
 * Compatibility alias for getMysqlPool to prevent breaking any legacy code.
 */
export function getPool(): mysql.Pool {
  return getMysqlPool();
}

let isInitialized = false;

/**
 * Ensures that the required table 'app_data' exists in the database.
 * Uses index-optimized schema definitions and TIMESTAMP values.
 */
async function ensureTableExists() {
  if (!useMysql) return;
  if (isInitialized) return;

  try {
    const dbPool = getMysqlPool();
    // Verify schema exists. App data is fully structured as dynamic key-value entries.
    // Index optimized for collection reads sorted by item_order.
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS app_data (
        collection VARCHAR(100) NOT NULL,
        id VARCHAR(255) NOT NULL,
        item_order INT NOT NULL,
        item_data TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (collection, id),
        INDEX idx_collection_order (collection, item_order)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    
    isInitialized = true;
    console.log("[MYSQL DATABASE] Secure schema configuration 'app_data' is fully active.");
  } catch (err) {
    console.error("[MYSQL DATABASE ERROR] Automatic schema creation failed. Falling back to local JSON storage:", err);
    useMysql = false; // Graceful switch to local json storage
  }
}

/**
 * Safely seeds the MySQL table from local JSON file if empty.
 * All inserts are fully parameterized to prevent SQL injection.
 */
async function migrateFileToSQLIfEmpty(collection: string) {
  if (!useMysql) return;

  try {
    const dbPool = getMysqlPool();
    const [rows]: any = await dbPool.query(
      "SELECT COUNT(*) as count FROM app_data WHERE collection = ?",
      [collection]
    );
    
    const count = parseInt(rows[0]?.count || '0');

    if (count === 0) {
      const jsonPath = path.join(DATA_DIR, `${collection}.json`);
      try {
        const fileContent = await fs.readFile(jsonPath, 'utf-8');
        const parsed = JSON.parse(fileContent);
        if (Array.isArray(parsed) && parsed.length > 0) {
          console.log(`[MYSQL DATABASE SEEDER] Seeding ${parsed.length} items for "${collection}"...`);
          
          for (let idx = 0; idx < parsed.length; idx++) {
            const item = parsed[idx];
            const itemId = String(item.id || `MIG-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`);
            
            // Fully parameterized insert to guarantee security
            await dbPool.query(
              "INSERT INTO app_data (collection, id, item_order, item_data) VALUES (?, ?, ?, ?)",
              [collection, itemId, idx, JSON.stringify(item)]
            );
          }
          console.log(`[MYSQL DATABASE SEEDER] Seeding for "${collection}" completed successfully.`);
        }
      } catch (fileErr) {
        // Local file does not exist or empty, skip seeding
      }
    }
  } catch (dbErr) {
    console.error(`[MYSQL DATABASE SEEDER ERROR] Automatic migration failed for "${collection}":`, dbErr);
  }
}

/**
 * Reads a list of objects belonging to a collection.
 * Securely uses parameterized prepared statements to query data.
 */
export async function readData<T>(filename: string): Promise<T[]> {
  if (useMysql) {
    try {
      await ensureTableExists();
      await migrateFileToSQLIfEmpty(filename);

      const dbPool = getMysqlPool();
      const [rows]: any = await dbPool.query(
        "SELECT item_data FROM app_data WHERE collection = ? ORDER BY item_order ASC",
        [filename]
      );

      return rows.map((r: any) => {
        try {
          return JSON.parse(r.item_data);
        } catch (e) {
          return r.item_data;
        }
      }) as T[];
    } catch (err) {
      console.error(`[MYSQL DATABASE READ ERROR] Read query failed for "${filename}". Reverting to local storage:`, err);
    }
  }

  // Fallback to local disk storage
  try {
    const filePath = path.join(DATA_DIR, `${filename}.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

/**
 * Writes/overwrites a list of objects belonging to a collection.
 * Uses atomic transaction controls to secure data integrity.
 * Parameterized statements prevent injection vulnerabilities.
 */
export async function writeData<T>(filename: string, data: T[]): Promise<void> {
  if (useMysql) {
    try {
      await ensureTableExists();

      const dbPool = getMysqlPool();
      const conn = await dbPool.getConnection();
      try {
        await conn.beginTransaction();

        // Safe parameterization for clean deletes
        await conn.query(
          "DELETE FROM app_data WHERE collection = ?",
          [filename]
        );

        if (data.length > 0) {
          const insertQuery = "INSERT INTO app_data (collection, id, item_order, item_data) VALUES (?, ?, ?, ?)";
          for (let idx = 0; idx < data.length; idx++) {
            const item = data[idx];
            const itemId = String((item as any).id || `SQL-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`);
            await conn.query(insertQuery, [filename, itemId, idx, JSON.stringify(item)]);
          }
        }

        await conn.commit();
        conn.release();
        return;
      } catch (txErr) {
        await conn.rollback();
        conn.release();
        throw txErr;
      }
    } catch (err) {
      console.error(`[MYSQL DATABASE WRITE ERROR] Save failed on collection "${filename}". Reverting to disk:`, err);
    }
  }

  // Fallback to local disk storage
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const filePath = path.join(DATA_DIR, `${filename}.json`);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error(`[MYSQL FS WRITE ERROR] Failed saving local document for "${filename}":`, e);
  }
}
