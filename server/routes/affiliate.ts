import express from 'express';
import { readData, writeData } from '../db.js';
import { authenticateAdmin } from './admin.js';

const router = express.Router();

router.get("/", async (req, res) => {
  const tools = await readData('affiliateTools');
  res.json(tools);
});

router.post("/", authenticateAdmin, async (req, res) => {
  const tool = req.body;
  const tools = await readData<any>('affiliateTools');
  tool.id = tool.id || `TL-${Date.now()}`;
  tools.push(tool);
  await writeData('affiliateTools', tools);
  res.json(tool);
});

router.put("/:id", authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const updatedTool = req.body;
  const tools = await readData<any>('affiliateTools');
  
  const index = tools.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Affiliate tool not found" });
  }
  
  tools[index] = { ...tools[index], ...updatedTool };
  await writeData('affiliateTools', tools);
  res.json(tools[index]);
});

router.delete("/:id", authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const tools = await readData<any>('affiliateTools');
  
  const filtered = tools.filter(t => t.id !== id);
  await writeData('affiliateTools', filtered);
  res.json({ success: true, message: "Affiliate tool deleted successfully" });
});

export default router;
