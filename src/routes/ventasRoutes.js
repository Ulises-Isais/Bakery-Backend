/**
 * Rutas de ventas
 * /api
 */
import { Router } from "express";

const router = Router();

import {
  salesCards,
  salesDespacho,
  salesDriver,
  salesRepartidoresTable,
} from "../controllers/ventasController.js";

// Endpoint para obtener card de ventas de repartidores
router.get("/sales/driver", salesDriver);

// Endpoint para obtener cards de las ventas del despacho
router.post("/sales/cards", salesCards);

// Endpoint para obtener datos del despacho
router.post("/sales/despacho", salesDespacho);

// Endpoint para obtener la tabla de repartidores
router.post("/sales/repartidores/table", salesRepartidoresTable);
export default router;
