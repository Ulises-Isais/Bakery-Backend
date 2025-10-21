/**
 * Rutas de ventas
 * /api/ventas
 */
const { Router } = require("express");
const router = Router();
const { salesDriver } = require("../controllers/ventas");

router.get("/sales", salesDriver);

module.exports = router;
