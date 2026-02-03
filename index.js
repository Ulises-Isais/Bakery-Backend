import express from "express";
import cors from "cors";
import authRoutes from "./src/routes/authRoutes.js";
import ventasRoutes from "./src/routes/ventasRoutes.js";
import inventoryRoutes from "./src/routes/inventoryRoutes.js";

//Crear el servidor de express
const app = express();

// CORS
app.use(cors());
//Directorio publico
app.use(express.static("public"));

//lectura y parseo del body
app.use(express.json());

// Registrar rutas

// Inicio de sesión
app.use("/api/auth", authRoutes);

// Ventas
app.use("/api", ventasRoutes);

// Inventario
app.use("/api", inventoryRoutes);

//Escuchar peticiones
app.listen(process.env.PORT, () => {
  console.log("Conexión exitosa a la base de datos");

  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});
