import express from 'express';
import { readData, writeData } from '../db.js';
import { authenticateAdmin } from './admin.js';

export interface CmsPage {
  id: string;
  slug: string;
  title: string;
  route: string;
  status: 'DRAFT' | 'PUBLISHED';
  body: string;
  updatedAt: string;
}

const router = express.Router();

// GET /api/pages/:slug
router.get("/:slug", async (req, res) => {
  const { slug } = req.params;
  try {
    const pages = await readData<CmsPage>('pages');
    // Find page where slug, id, or route matches the parameter (handling leading slash just in case)
    const page = pages.find((p: CmsPage) => 
      p.slug === slug || 
      p.id === slug || 
      p.route === `/${slug}` || 
      p.route === slug
    );
    
    if (!page) {
      return res.status(404).json({ error: `Page '${slug}' not found` });
    }
    
    res.json(page);
  } catch (error) {
    console.error(`Error reading pages list:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/pages
router.get("/", async (req, res) => {
  try {
    const pages = await readData<CmsPage>('pages');
    res.json(pages);
  } catch (error) {
    console.error(`Error listing pages:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/pages - Create new page
router.post("/", authenticateAdmin, async (req, res) => {
  try {
    const { slug, title, route, status, body } = req.body;
    if (!slug || !title) {
      return res.status(400).json({ error: "Slug and title are strictly required" });
    }

    const pages = await readData<CmsPage>('pages');
    const existing = pages.find((p: CmsPage) => p.slug === slug);
    if (existing) {
      return res.status(400).json({ error: `Page with slug '${slug}' already exists` });
    }

    const newPage: CmsPage = {
      id: slug,
      slug,
      title,
      route: route || `/${slug}`,
      status: status || "DRAFT",
      body: body || "",
      updatedAt: new Date().toISOString()
    };

    pages.push(newPage);
    await writeData<CmsPage>('pages', pages);
    res.status(201).json(newPage);
  } catch (error) {
    console.error(`Error creating page:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/pages/:id - Update existing page
router.put("/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { slug, title, route, status, body } = req.body;

    const pages = await readData<CmsPage>('pages');
    const index = pages.findIndex((p: CmsPage) => p.id === id || p.slug === id);
    if (index === -1) {
      return res.status(404).json({ error: "Page not found" });
    }

    const updatedPage: CmsPage = {
      ...pages[index],
      slug: slug || pages[index].slug,
      title: title || pages[index].title,
      route: route || pages[index].route,
      status: status || pages[index].status,
      body: body !== undefined ? body : pages[index].body,
      updatedAt: new Date().toISOString()
    };

    pages[index] = updatedPage;
    await writeData<CmsPage>('pages', pages);
    res.json(updatedPage);
  } catch (error) {
    console.error(`Error updating page:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/pages/:id - Delete page
router.delete("/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const pages = await readData<CmsPage>('pages');
    const index = pages.findIndex((p: CmsPage) => p.id === id || p.slug === id);
    if (index === -1) {
      return res.status(404).json({ error: "Page not found" });
    }

    const deleted = pages.splice(index, 1);
    await writeData<CmsPage>('pages', pages);
    res.json({ message: "Page deleted successfully", page: deleted[0] });
  } catch (error) {
    console.error(`Error deleting page:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
