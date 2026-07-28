/**
 * Rutas de ventas
 * /api
 */
import { Router } from "express";

const router = Router();

import {
  addCharolas,
  driverSettlement,
  getCharolasRepartidor,
  salesCards,
  salesDespacho,
  salesDriver,
  salesRepartidoresTable,
} from "../controllers/ventasController.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

// Endpoint para obtener card de ventas de repartidores
router.get("/sales/driver", salesDriver);

// Endpoint para obtener cards de las ventas del despacho
router.post("/sales/cards", salesCards);

// Endpoint para obtener datos del despacho
router.post("/sales/despacho", salesDespacho);

// Endpoint para obtener la tabla de repartidores
router.post("/sales/repartidores/table", salesRepartidoresTable);

// Endpoint para obtener las charolas de los repartidores
router.post("/sales/charolas/repartidor", getCharolasRepartidor);

// Endpoint para agregar charolas a la tabla
router.post("/sales/charolas", validarJWT, addCharolas);

// Endpoint para actualizar el corte del repartidor
router.post("/sales/driver-settlement", validarJWT, driverSettlement);
export default router;
