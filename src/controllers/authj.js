import { response } from "express";
import pool from "./config/db.js";
import bcrypt from "bcrypt";

//Inicio de sesión

const loginUser = async (req, res = response) => {
  const { user, password } = req.body;

  if (!user || !password) {
    return res.status(400).json({
      ok: false,
      msg: "El usuario y la contraseña son obligatorios",
    });
  }

  try {
    // Realizar la consulta SQL para encontrar el usuario
    const [results] = await pool.query(
      "SELECT * FROM usuarios WHERE username = ?",
      [user]
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

    //Login exitoso
    return res.json({
      ok: true,
      msg: "Login exitoso",
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

//Actualizar contraseña
const updatePassword = async (req, res = response) => {
  const { user, newPassword } = req.body;

  if (!user || !newPassword) {
    return res.status(400).json({
      ok: false,
      msg: "Usuario y nueva contraseña son obligatorios",
    });
  }

  try {
    //Verificar si existe el usuario
    const [results] = await pool.query(
      "SELECT * FROM usuarios WHERE username = ?",
      [user]
    );
    if (results.lenght === 0) {
      return res.status(404).json({
        ok: false,
        msg: "usuario no encontrado",
      });
    }

    //Hashear la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    //Actualizar contraseña en la BD
    await pool.query(
      "UPDATE usuarios SET password = ? WHERE username = ?",
      [hashedPassword],
      [user]
    );

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

module.exports = {
  loginUser,
  updatePassword,
};
