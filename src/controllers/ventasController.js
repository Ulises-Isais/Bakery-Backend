import { response } from "express";
import pool from "../config/db.js";

// Mostrar ventas totales del día
export const salesCards = async (req, res = response) => {
  try {
    const { fecha = "2025-09-12", turno = "mañana" } = req.body || {};

    // Validar que venga la fecha
    if (!fecha) {
      return res.status(400).json({
        ok: false,
        msg: "La fecha es obligatioria",
      });
    }

    // venta de la mañana
    const [rows] = await pool.query(
      `SELECT id_categoria,
      total_por_categoria,
      total_general
      FROM corte_caja
      WHERE fecha = ? AND turno = ?
      `,
      [fecha, turno]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        ok: false,
        msg: "No se encontró corte de caja para la fecha y turno indicados",
      });
    }

    // Calucular totales generales

    const totalGeneral = rows.reduce(
      (acc, row) => acc + Number(row.total_por_categoria),
      0
    );

    // // Venta de la tarde
    // const [afternoon] = await pool.query(
    //   `SELECT IFNULL(SUM(d.vendido * p.precio),0) AS total_tarde
    //     FROM despacho d
    //     JOIN productos p ON d.id_producto = p.id_producto
    //     WHERE d.turno = 'tarde' AND d.fecha = ?`,
    //   [fecha]
    // );

    // Total despacho

    // const totalGeneral =
    //   Number(morning[0].total_manana) + Number(morning[0].total_tarde);

    res.status(200).json({
      ok: true,
      turno,
      fecha,
      corte: rows,
      totalGeneral,
      // totalTarde: afternoon[0].total_tarde,
      // totalGeneral,
    });
  } catch (error) {
    console.error("Error al obtener las ventas:", error);
    res.status(500).json({
      ok: false,
      msg: "Error al obtener ventas",
    });
  }
};

export const salesDriver = async (req, res = response) => {
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

// TODO: HACER LAS VENTAS DEL DESPACHO
export const salesDespacho = async (req, res = response) => {
  // Obtener ventas del despacho

  try {
  } catch (error) {}
};

export const generarCorteCaja = async (req, res = response) => {
  try {
    const { fecha, turno } = req.body;

    const [rows] = await pool.query(
      ` INSERT INTO corte_caja (fecha, turno, id_categoria, total_por_categoria)
      SELECT 
          d.fecha,
          d.turno,
          p.id_categoria,
          SUM(d.vendido * p.precio) AS total_por_categoria
      FROM despacho d
      JOIN productos p ON d.id_producto = p.id_producto
      WHERE d.turno = ? AND d.fecha = ?
      GROUP BY d.fecha, d.turno, p.id_categoria
      `,
      [turno, fecha]
    );
    res.json({ ok: true, msg: "Corte de caja generado exitosamente", rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error al generar el corte" });
  }
};

const inventory = () => {};
