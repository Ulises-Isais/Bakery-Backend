import { response } from "express";
import pool from "../config/db.js";

export const getRepartidores = async (req, res = response) => {
  try {
    const [rows] = await pool.query(
      `
    SELECT id_repartidor, nombre
    FROM repartidores
    `,
    );

    return res.status(200).json({
      ok: true,
      repartidores: rows,
    });
  } catch (error) {
    console.error("Error en getRepartidores:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error al obtener repartidores",
    });
  }
};
