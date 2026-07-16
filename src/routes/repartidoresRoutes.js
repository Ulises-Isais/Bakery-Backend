import { Router } from "express";
import { getRepartidores } from "../controllers/repartidoresController.js";

const router = Router();

// Obtener lista de repartidores
router.get("/repartidores", getRepartidores);

export default router;
