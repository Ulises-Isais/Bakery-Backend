/**
 * Rutas de usuario auth/
 * host + api/auth
 */

import { Router } from "express";
import { check } from "express-validator";
import {
  loginUser,
  updatePassword,
  revalidarToken,
  authMe,
} from "../controllers/authController.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

/**
 * @route POST /api/auth
 * @description Iniciar sesión
 *  */
router.post(
  "/login",
  [
    // Middlewares
    check("username", "El usuario es obligatorio").not().isEmpty(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  loginUser,
);

/**
 *@ROUTE PUT /api/auth/forgot
 * @description Actualizar contraseña olvidada
 */

router.put(
  "/forgot",
  [
    check("username", "El usuario es obligatorio").not().isEmpty(),
    check("newPassword", "La nueva contraseña es obligatoria").isLength({
      min: 6,
    }),
    validarCampos,
  ],
  updatePassword,
);

/**
 * @route GET /api/auth/renew
 * @description Revalidar y renovar el token
 */

router.get("/renew", validarJWT, revalidarToken);

/**
 * @route GET /api/auth/me
 * @description
 */
router.get("/me", validarJWT, authMe);

/**
 * @route POST /api/auth/change-password
 * @description cambiar la contraseña del usuario
 */
router.post("/change-password", updatePassword);
export default router;
