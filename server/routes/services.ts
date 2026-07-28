import express from 'express';
import { readData, writeData } from '../db.js';
import { authenticateAdmin } from './admin.js';

const router = express.Router();

router.get("/", async (req, res) => {
  const services = await readData('services');
  res.json(services);
});

router.post("/", authenticateAdmin, async (req, res) => {
  const service = req.body;
  const services = await readData<any>('services');
  service.id = service.id || `SRV-${Date.now()}`;
  services.push(service);
  await writeData('services', services);
  res.json(service);
});

router.put("/:id", authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const service = req.body;
  const services = await readData<any>('services');
  const index = services.findIndex((s: any) => s.id === id);
  if (index !== -1) {
    services[index] = { ...services[index], ...service };
    await writeData('services', services);
    return res.json(services[index]);
  }
  res.status(404).json({ error: "Service not found" });
});

router.delete("/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const services = await readData<any>('services');
    const filtered = services.filter((s: any) => s.id !== id);
    await writeData('services', filtered);
    res.json({ success: true, message: "Service removed" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete service" });
  }
});

export default router;
