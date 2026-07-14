<<<<<<< Updated upstream
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
=======
import pool from "../config/db.js";

export const getRepartidores = async (req, res) => {
  try {
    const [rows] = await pool.query(`
    SELECT
        id_repartidor,
        nombre
    FROM repartidores
    ORDER BY nombre

    `);

    res.json({
>>>>>>> Stashed changes
      ok: true,
      repartidores: rows,
    });
  } catch (error) {
<<<<<<< Updated upstream
    console.error("Error en getRepartidores:", error);
    return res.status(500).json({
=======
    console.error(error);

    res.status(500).json({
>>>>>>> Stashed changes
      ok: false,
      msg: "Error al obtener repartidores",
    });
  }
};
