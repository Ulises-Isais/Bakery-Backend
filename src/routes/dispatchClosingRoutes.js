import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.js";
import {
  closeDispatchController,
  previewDispatchClosing,
} from "../controllers/dispatchClosingController.js";
import {
  confirmMovementController,
  getPendingMovementsController,
  rejectMovementController,
} from "../controllers/dispatchMovementsController.js";

const router = Router();

/**
 * Preview del cierre de despacho.
 *
 * Obtiene la información necesearia del turno para posteriormente calcular
 */

router.post("/preview", validarJWT, previewDispatchClosing);

/**
 * Cierre del despacho.
 */
router.post("/", validarJWT, closeDispatchController);

router.post("/movements/pending", validarJWT, getPendingMovementsController);

router.post("/movement/confirm", validarJWT, confirmMovementController);

router.post("/movement/reject", validarJWT, rejectMovementController);
export default router;
