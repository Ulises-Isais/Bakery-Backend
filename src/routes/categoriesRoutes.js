import { Router } from "express";
import { getCategorias } from "../controllers/categoriesController.js";

const router = Router();
<<<<<<< Updated upstream

router.get("/categorias", getCategorias);
=======
console.log("Cargar rutas");

router.get("/", getCategorias);
>>>>>>> Stashed changes

export default router;
