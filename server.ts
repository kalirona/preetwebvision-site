import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

// Import Routes
import adminRoutes from "./server/routes/admin.js";
import leadRoutes from "./server/routes/leads.js";
import seoRoutes from "./server/routes/seo.js";
import serviceRoutes from "./server/routes/services.js";
import affiliateRoutes from "./server/routes/affiliate.js";
import postRoutes from "./server/routes/posts.js";
import bookingRoutes from "./server/routes/bookings.js";
import chatRoutes from "./server/routes/chat.js";
import settingsRoutes from "./server/routes/settings.js";
import mediaRoutes from "./server/routes/media.js";
import contactRoutes from "./server/routes/contacts.js";
import menusRoutes from "./server/routes/menus.js";
import pagesRoutes from "./server/routes/pages.js";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Module Routes
  app.use("/api/admin", adminRoutes);
  app.use("/api/lead", leadRoutes);
  app.use("/api/seo", seoRoutes);
  app.use("/api/services", serviceRoutes);
  app.use("/api/affiliate", affiliateRoutes);
  app.use("/api/posts", postRoutes);
  app.use("/api/bookings", bookingRoutes);
  app.use("/api/chat", chatRoutes);
  app.use("/api/settings", settingsRoutes);
  app.use("/api/media", mediaRoutes);
  app.use("/api/contacts", contactRoutes);
  app.use("/api/menus", menusRoutes);
  app.use("/api/pages", pagesRoutes);

  // POST /api/webhook/saas-sync
  app.post("/api/webhook/saas-sync", (req, res) => {
    console.log("[SAAS WEBHOOK RECEIVED]:", req.body);
    res.status(200).send("OK");
  });


  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
