import express from "express";
import cors from "cors";

//Crear el servidor de express
const app = express();

// CORS
app.use(cors());
//Directorio publico
app.use(express.static("public"));

//lectura y parseo del body
app.use(express.json());

//Escuchar peticiones
app.listen(process.env.PORT, () => {
  console.log("Conexión exitosa a la base de datos");

  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});
