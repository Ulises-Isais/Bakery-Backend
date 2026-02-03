import { Router } from "express";
import { getInventory } from "../controllers/inventoryController.js";

const router = Router();

router.get("/inventory", getInventory);

export default router;
