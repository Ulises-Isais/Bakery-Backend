import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { previewDispatchClosing } from "../controllers/dispatchClosingController.js";
const router = Router();

/**
 * Preview del cierre de despacho.
 *
 * Obtiene la información necesearia del turno para posteriormente calcular
 */

router.post("/preview", validarJWT, previewDispatchClosing);

export default router;
