import express from 'express';
import { readData, writeData } from '../db.js';
import { authenticateAdmin } from './admin.js';

const router = express.Router();

const DEFAULT_MENUS = [
  { id: "menu-1", name: 'Home', path: '/', order: 1 },
  { id: "menu-2", name: 'Services', path: '/services', order: 2 },
  { id: "menu-5", name: 'About', path: '/about', order: 3 },
  { id: "menu-3", name: 'Portfolio', path: '/case-studies', order: 4 },
  { id: "menu-4", name: 'Blog', path: '/blog', order: 5 },
  { id: "menu-6", name: 'Resources', path: '/tools', order: 6 },
  { id: "menu-7", name: 'Contact Now', path: '/contact', order: 7 }
];

const getMenus = async () => {
  let list = await readData<any>('menus');
  if (list.length === 0) {
    list = DEFAULT_MENUS;
    await writeData('menus', list);
  }
  return list.sort((a, b) => (a.order || 0) - (b.order || 0));
};

// GET /api/menus - Fetch dynamic navigation links
router.get("/", async (req, res) => {
  try {
    const list = await getMenus();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Failed to read navigation menus database." });
  }
});

// POST /api/menus - Admin creates a new menu link
router.post("/", authenticateAdmin, async (req, res) => {
  try {
    const { name, path, order, parentId } = req.body;
    if (!name || !path) {
      return res.status(400).json({ error: "Menu Name and Path/slug are mandatory." });
    }

    const list = await getMenus();
    const newMenu = {
      id: `menu-${Date.now()}`,
      name,
      path,
      order: Number(order) || (list.length + 1),
      parentId: parentId || ""
    };

    list.push(newMenu);
    await writeData('menus', list);
    res.status(201).json(newMenu);
  } catch (err) {
    res.status(500).json({ error: "Failed to persist menu element." });
  }
});

// PUT /api/menus/:id - Admin updates link or title details
router.put("/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, path, order, parentId } = req.body;

    const list = await getMenus();
    const idx = list.findIndex(m => m.id === id);

    if (idx !== -1) {
      list[idx] = {
        ...list[idx],
        name: name || list[idx].name,
        path: path || list[idx].path,
        order: order !== undefined ? Number(order) : list[idx].order,
        parentId: parentId !== undefined ? parentId : list[idx].parentId || ""
      };

      await writeData('menus', list);
      return res.json(list[idx]);
    }
    res.status(404).json({ error: "Menu element not found." });
  } catch (err) {
    res.status(500).json({ error: "Failed to alter menu config." });
  }
});

// DELETE /api/menus/:id - Hard erase a menu item
router.delete("/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const list = await getMenus();
    const filtered = list.filter(m => m.id !== id);

    await writeData('menus', filtered);
    res.json({ success: true, message: "Menu node erased." });
  } catch (err) {
    res.status(500).json({ error: "Failed deletion protocol." });
  }
});

export default router;
