import { Router } from "express";
import { getCategorias } from "../controllers/categoriesController.js";

const router = Router();

router.get("/categorias", getCategorias);

export default router;
