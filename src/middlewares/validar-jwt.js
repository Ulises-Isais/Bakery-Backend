import { response } from "express";
import jwt from "jsonwebtoken";

export const validarJWT = (req, res = response, next) => {
  //x-token en los headers
  const token = req.header("x-token");
  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "No hay token en la petición",
    });
  }
  try {
    const { matricula, nombre } = jwt.verify(
      token,
      process.env.SECRET_JWT_SEED
    );
    req.matricula = matricula;
    req.nombre = nombre;
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "Token no valido",
    });
  }

  next();
};
