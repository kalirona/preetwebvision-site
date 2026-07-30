# Preet Web Vision - aaPanel Deployment Guide

## Project Information
- **Application Type**: Full-stack JavaScript (React + Node.js/Express)
- **Build Tool**: Vite
- **Server Port**: 3000
- **Database**: JSON file-based (data/) with optional MySQL support

---

## Admin Login Information

### Admin API Endpoint
**Path**: `POST /api/admin/login`

### Default Credentials
- **Username**: admin
- **Password**: `admin123` (default)
- **Environment Variable**: `ADMIN_PASSWORD` (can be customized)

### Authentication Flow
1. Send POST request with `password` and optional `code` (for 2FA)
2. If password is correct and 2FA is enabled, a 6-digit TOTP code is required
3. Server returns JWT token valid for 2 hours
4. Use token in Authorization header: `Bearer <token>`

### Example Login Request
```bash
curl -X POST http://your-domain.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password":"admin123"}'
```

### Security Features
- JWT-based authentication (HS256)
- Optional TOTP 2FA (Google Authenticator compatible)
- Security event logging
- IP tracking
- Session expiration (2 hours)

---

## Prerequisites on aaPanel

### 1. Install Node.js
```bash
# Via aaPanel terminal or SSH
# Node.js version: 18.x or higher required
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

### 3. Install Nginx
- Already available in aaPanel, ensure it's installed via aaPanel App Store

---

## Step-by-Step Deployment

### Step 1: Upload Project Files
```bash
# Upload to /www/wwwroot/your-domain.com/ directory
# You can use FTP, File Manager, or git clone
cd /www/wwwroot/
git clone https://github.com/kalirona/preetwebvision-site.git your-domain.com
cd your-domain.com
```

### Step 2: Install Dependencies
```bash
cd /www/wwwroot/your-domain.com
npm install --production
```

### Step 3: Configure Environment Variables
Create `.env` file in project root:

```bash
# .env file configuration
JWT_SECRET=your-secure-jwt-secret-key-here
ADMIN_PASSWORD=your-secure-password-here
NODE_ENV=production
PORT=3000

# Database Configuration (optional - uses JSON by default)
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
```

**Secure the .env file:**
```bash
chmod 600 /www/wwwroot/your-domain.com/.env
```

### Step 4: Build the Application
```bash
cd /www/wwwroot/your-domain.com
npm run build
```

This creates:
- `dist/` folder with compiled server
- `dist/index.html` with built frontend assets

### Step 5: Create PM2 Configuration
Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'preet-web-vision',
    script: './dist/server.cjs',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

### Step 6: Start Application with PM2
```bash
cd /www/wwwroot/your-domain.com
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

Verify it's running:
```bash
pm2 status
pm2 logs preet-web-vision
```

---

## Nginx Configuration (aaPanel)

### Option 1: Using aaPanel Website Settings
1. Login to aaPanel
2. Go to **Website** → Your domain → **Settings**
3. Set website directory to: `/www/wwwroot/your-domain.com/dist`

### Option 2: Manual Nginx Config (Recommended for Proxy)
Create config file: `/www/server/panel/vhost/nginx/your-domain.com.conf`

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    root /www/wwwroot/your-domain.com/dist;
    index index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";

    # Proxy API requests to Node.js
    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Serve static files directly
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Deny access to sensitive files
    location ~ /\. {
        deny all;
    }

    # Logging
    access_log /www/wwwlogs/your-domain.com.log;
    error_log /www/wwwlogs/your-domain.com.error.log;
}
```

**Test and reload Nginx:**
```bash
nginx -t
systemctl reload nginx
```

---

## Firewall Configuration (aaPanel)

### Open Required Ports
```bash
# Via aaPanel Security panel, allow ports:
# Port 80 (HTTP)
# Port 443 (HTTPS - if using SSL)
# Port 3000 (backend API - if accessing directly)
```

---

## SSL Certificate (Recommended)

### Using Let's Encrypt in aaPanel
1. Go to **Website** → Your domain → **SSL**
2. Select **Let's Encrypt**
3. Enter your email
4. Click **Apply**

This will automatically configure HTTPS and redirect HTTP to HTTPS.

---

## Database Setup

### Option A: JSON Files (Default)
- No database required
- All data stored in `/data/` folder
- Suitable for small to medium applications

### Option B: MySQL Database (Optional)
```bash
# In aaPanel, create a database via **Database** menu
# Note down: database name, username, password

# Update .env file with MySQL credentials
DB_HOST=localhost
DB_USER=your_user
DB_PASSWORD=your_pass
DB_NAME=your_db
```

Update `server/db.ts` to use MySQL instead of JSON files.

---

## Post-Deployment Steps

### 1. Test Application
```bash
# Check if app is running
curl http://your-domain.com/api/health

# Expected response: {"status":"ok","timestamp":"2024-..."}
```

### 2. Test Admin Login
```bash
# Test admin login endpoint
curl -X POST http://your-domain.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password":"admin123"}'
```

### 3. Change Default Admin Password
```bash
# Update .env file
ADMIN_PASSWORD=your_new_secure_password

# Restart application
pm2 restart preet-web-vision
```

---

## Useful Management Commands

### PM2 Commands
```bash
# View status
pm2 status

# View logs
pm2 logs preet-web-vision

# Restart application
pm2 restart preet-web-vision

# Stop application
pm2 stop preet-web-vision

# Update after code changes
pm2 reload preet-web-vision
```

### Application Updates
```bash
cd /www/wwwroot/your-domain.com
git pull origin main
npm install
npm run build
pm2 reload preet-web-vision
```

---

## Troubleshooting

### Port 3000 already in use
```bash
# Check what's using port 3000
netstat -tlnp | grep 3000

# Change PORT in ecosystem.config.js or .env
```

### Permission denied errors
```bash
# Fix directory permissions
chown -R www:www /www/wwwroot/your-domain.com
chmod -R 755 /www/wwwroot/your-domain.com
chmod 600 /www/wwwroot/your-domain.com/.env
```

### Nginx 502 Bad Gateway
```bash
# Check if Node.js app is running
pm2 status

# Check if running on correct port
curl http://127.0.0.1:3000
```

### Build failures
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

---

## Security Recommendations

1. **Change default admin password immediately**
2. **Use strong JWT_SECRET** (32+ random characters)
3. **Enable 2FA** in admin panel (if available)
4. **Enable SSL/HTTPS** via Let's Encrypt
5. **Restrict database access** (use strong passwords)
6. **Regular backups** of `/data/` folder
7. **Keep Nginx and Node.js updated**
8. **Configure firewall** to close unnecessary ports
9. **Enable fail2ban** for brute force protection
10. **Monitor logs** regularly for suspicious activity

---

## File Structure Summary

```
/www/wwwroot/your-domain.com/
├── dist/                    # Compiled production files
│   ├── server.cjs          # Compiled server
│   └── index.html          # Built frontend
├── src/                    # Source code
├── server/                 # Backend routes
├── data/                   # JSON database (auto-created)
├── .env                    # Environment variables (SECURE THIS)
├── package.json
├── ecosystem.config.js     # PM2 configuration
└── server.ts               # Main server entry
```

---

## Admin Panel Access

**Admin Login URL**: http://your-domain.com/admin/login

**Admin Dashboard URL**: http://your-domain.com/admin/dashboard

**API Endpoints** (authenticated):
- `GET /api/admin/security/status`
- `POST /api/admin/security/generate-2fa-secret`
- `POST /api/admin/security/verify-and-enable-2fa`
- `GET /api/admin/security/vulnerability-data`
- `POST /api/admin/security/vulnerability-scan`

---

## Support Information

- **Repository**: https://github.com/kalirona/preetwebvision-site
- **Build Command**: `npm run build`
- **Start Command**: `pm2 start ecosystem.config.js`
- **Node Version**: 18.x or higher
- **Default Port**: 3000

---

## Quick Deployment Checklist

- [ ] Upload/Clone project files to `/www/wwwroot/your-domain.com/`
- [ ] Install Node.js (v18+) and PM2
- [ ] Run `npm install --production`
- [ ] Create `.env` file with secure secrets
- [ ] Run `npm run build`
- [ ] Create PM2 ecosystem.config.js
- [ ] Start application with PM2
- [ ] Configure Nginx (reverse proxy or direct serve)
- [ ] Open firewall ports (80, 443, 3000)
- [ ] Install SSL certificate via Let's Encrypt
- [ ] Test application: `http://your-domain.com/api/health`
- [ ] Test admin login: `POST /api/admin/login`
- [ ] Change default admin password
- [ ] Enable 2FA in admin panel

---

**Deployment Complete!** Your Preet Web Vision application should now be live at `http://your-domain.com`