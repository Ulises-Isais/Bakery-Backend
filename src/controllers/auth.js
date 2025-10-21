import { response } from "express";
import pool from "../config/db.js";
import bcrypt from "bcrypt";
import { generarJWT } from "../helpers/jwt.js";
//Inicio de sesión

export const loginUser = async (req, res = response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      ok: false,
      msg: "El usuario y la contraseña son obligatorios",
    });
  }

  try {
    // Realizar la consulta SQL para encontrar el usuario
    const [results] = await pool.query(
      "SELECT * FROM usuarios WHERE username = ?",
      [username]
    );
    if (results.length === 0) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no encontrado",
      });
    }

    const usuario = results[0];

    //comparar la contraseña con bcrypt
    const validPasword = await bcrypt.compare(password, usuario.password);
    if (!validPasword) {
      return res.status(401).json({
        ok: false,
        msg: "Contraseña incorrecta",
      });
    }

    // Generar JWT
    const token = await generarJWT(usuario.username, usuario.role);

    //Login exitoso
    return res.json({
      ok: true,
      token,
      user: {
        id: usuario.id,
        username: usuario.username,
        role: usuario.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Error en el servidor",
    });
  }
};

export const revalidarToken = async (req, res = response) => {
  const { username, role } = req;

  //Generar un nuevo JWT Y retornarlo en la peticion
  const token = await generarJWT(username, role);

  res.json({
    ok: true,
    token,
  });
};

//Actualizar contraseña
export const updatePassword = async (req, res = response) => {
  const { username, newPassword } = req.body;

  if (!username || !newPassword) {
    return res.status(400).json({
      ok: false,
      msg: "Usuario y nueva contraseña son obligatorios",
    });
  }

  try {
    //Verificar si existe el usuario
    const [results] = await pool.query(
      "SELECT * FROM usuarios WHERE username = ?",
      [username]
    );
    if (results.length === 0) {
      return res.status(404).json({
        ok: false,
        msg: "usuario no encontrado",
      });
    }

    //Hashear la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    //Actualizar contraseña en la BD
    await pool.query("UPDATE usuarios SET password = ? WHERE username = ?", [
      hashedPassword,
      username,
    ]);

    return res.json({
      ok: true,
      msg: "Contraseña actualizada correctamente",
    });
  } catch (error) {
    console.error("Error al actualizar la contraseña", error);
    return res.status(500).json({
      ok: false,
      msg: "Error en el servidor",
    });
  }
};
