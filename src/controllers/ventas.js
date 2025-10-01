import { response } from "express";
import pool from "./config/db.js";

// Mostrar ventas totales del día
const salesCards = async (req, res = response) => {
  try {
    const today = "2025-09-12";

    // venta de la mañana
    const [morning] = await pool.query(
      `SELECT IFNULL(SUM(d.consumo * p.precio),0) AS total_manana
        FROM despacho d
        JOIN productos p ON d.id_producto = p.id_producto
        WHERE d.turno = 'mañana' AND d.fecha = ?`,
      [today]
    );

    // Venta de la tarde
    const [afternoon] = await pool.query(
      `SELECT IFNULL(SUM(d.consumo * p.precio),0) AS total_tarde
        FROM despacho d
        JOIN productos p ON d.id_producto = p.id_producto
        WHERE d.turno = 'tarde' AND d.fecha = ?`,
      [today]
    );

    res.json({
      ok: true,
      totalManana: morning[0].total_manana,
      totalTarde: afternoon[0].total_tarde,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al obtener Cards",
    });
  }
};

const salesDriver = () => {};

const salesDespacho = () => {};

const inventory = () => {};
