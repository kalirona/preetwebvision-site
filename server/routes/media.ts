import express from 'express';
import { readData, writeData } from '../db.js';
import { authenticateAdmin } from './admin.js';

const router = express.Router();

const INITIAL_MEDIA = [
  {
    id: "med-1",
    name: "seo-analytics-dashboard.webp",
    alt: "SEO Analytics Dashboard Showing Web Traffic Growth",
    url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    size: "42 KB",
    type: "image/webp",
    dimensions: "1200 x 630",
    folder: "Dashboards",
    uploadedAt: new Date(Date.now() - 3600 * 10 * 1000).toISOString()
  },
  {
    id: "med-2",
    name: "ai-brain-neural-network.jpg",
    alt: "AI Neural Brain Network Illustration",
    url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
    size: "108 KB",
    type: "image/jpeg",
    dimensions: "1950 x 1300",
    folder: "Creative Concepts",
    uploadedAt: new Date(Date.now() - 3600 * 5 * 1000).toISOString()
  },
  {
    id: "med-3",
    name: "man-working-fast-code.jpg",
    alt: "Developer writing optimized code fast layout",
    url: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80",
    size: "82 KB",
    type: "image/jpeg",
    dimensions: "1600 x 1000",
    folder: "Graphics",
    uploadedAt: new Date(Date.now() - 3600 * 2 * 1000).toISOString()
  }
];

// GET /api/media
router.get("/", async (req, res) => {
  let list = await readData<any>('media');
  if (list.length === 0) {
    list = INITIAL_MEDIA;
    await writeData('media', list);
  }
  res.json(list);
});

// POST /api/media (upload / add simulated resource)
router.post("/", authenticateAdmin, async (req, res) => {
  try {
    const { name, alt, url, size, type, dimensions, folder } = req.body;
    if (!name || !url) {
      return res.status(400).json({ error: "Name and URL are required" });
    }

    const list = await readData<any>('media');
    const newItem = {
      id: `MED-${Date.now()}`,
      name,
      alt: alt || name.split(".")[0],
      url,
      size: size || "120 KB",
      type: type || "image/jpeg",
      dimensions: dimensions || "1024 x 768",
      folder: folder || "Unsorted",
      uploadedAt: new Date().toISOString()
    };

    list.unshift(newItem);
    await writeData('media', list);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to upload media item" });
  }
});

// POST /api/media/compress (simulate smart auto-compression)
router.post("/compress", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.body;
    const list = await readData<any>('media');
    const idx = list.findIndex((m: any) => m.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: "Media item not found" });
    }
    
    // Convert KB size, e.g. "120 KB" -> "48 KB" (60% compression)
    const originalSize = list[idx].size;
    const sizeNumber = parseInt(originalSize);
    if (!isNaN(sizeNumber)) {
      const compressedVal = Math.round(sizeNumber * 0.4);
      list[idx].size = `${compressedVal} KB (Optimized WebP)`;
      list[idx].name = list[idx].name.split(".")[0] + ".webp";
      list[idx].type = "image/webp";
    }

    await writeData('media', list);
    res.json(list[idx]);
  } catch (err) {
    res.status(500).json({ error: "Simulated WebP compression failed" });
  }
});

// PUT /api/media/:id (update alt text, folder, title)
router.put("/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { alt, folder, name } = req.body;
    const list = await readData<any>('media');
    const idx = list.findIndex((m: any) => m.id === id);

    if (idx !== -1) {
      list[idx] = {
        ...list[idx],
        alt: alt !== undefined ? alt : list[idx].alt,
        folder: folder !== undefined ? folder : list[idx].folder,
        name: name !== undefined ? name : list[idx].name,
      };
      await writeData('media', list);
      return res.json(list[idx]);
    }
    res.status(404).json({ error: "Media item not found" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update media item" });
  }
});

// DELETE /api/media/:id
router.delete("/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const list = await readData<any>('media');
    const filtered = list.filter((m: any) => m.id !== id);

    if (list.length === filtered.length) {
      return res.status(404).json({ error: "Media not found" });
    }

    await writeData('media', filtered);
    res.json({ success: true, message: "Media deleted from disk" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete media" });
  }
});

export default router;
