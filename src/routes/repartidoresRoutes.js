import { Router } from "express";
import { getRepartidores } from "../controllers/repartidoresController.js";

const router = Router();
<<<<<<< Updated upstream

// Obtener lista de repartidores
router.get("/repartidores", getRepartidores);
=======
console.log("Cargando repartidores");

router.get("/", getRepartidores);
>>>>>>> Stashed changes

export default router;
