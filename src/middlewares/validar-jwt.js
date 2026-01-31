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
    const { uid, username, role, turno } = jwt.verify(
      token,
      process.env.SECRET_JWT_SEED,
    );
    // Guardar datos del usuario en el request
    req.uid = uid;
    req.username = username;
    req.role = role;
    req.turno = turno;

    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "Token no valido",
    });
  }
};
