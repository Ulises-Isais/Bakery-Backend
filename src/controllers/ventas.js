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

    res.status(200).json({
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

const salesDriver = async (req, res = response) => {
  // Mostrar ventas de repartidores
  try {
    // Consulta SQL: Obtener todas las ventas junto con el nombre del repartidor
    const [rows] = await pool.query(`
      SELECT 
        v.id_venta,
        r.nombre AS repartidor,
        v.fecha,
        v.total,
        v.dinero_pendiente,
        v.notas
      FROM ventas v
      INNER JOIN repartidores r ON v.id_repartidor = r.id_repartidor
      ORDER BY v.Fecha DESC;
      `);

    // Si no hay resultados
    if (rows.length === 0) {
      return res.status(404).json({
        ok: false,
        msg: "No se encontraron ventas registradas",
      });
    }

    // Respuesta exitosa
    return res.status(200).json({
      ok: true,
      totalVentas: rows.length,
      ventas: rows,
    });
  } catch (error) {
    console.error("Error al obtener las ventas:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error en el servidor al obtener las ventas",
    });
  }
};

const salesDespacho = () => {};

const inventory = () => {};

module.exports = {
  salesDriver,
  salesDespacho,
  salesCards,
  inventory,
};
