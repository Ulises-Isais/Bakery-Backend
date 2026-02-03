import { response } from "express";
import pool from "../config/db.js";

export const getInventory = async (req, res = response) => {
  try {
    const [rows] = await pool.query(
      `SELECT
        id_inventario,
        id_producto,
        producto,
        entraron,
        quedan,
        unidad,
        proveedor,
        minimo,
        fecha_ultimo_ingreso,
        observaciones
      FROM inventario
      ORDER BY producto ASC
        `,
    );

    if (rows.length === 0) {
      return res.status(200).json({
        ok: true,
        inventario: [],
        msg: "inventario vacío",
      });
    }

    // Normalización
    const inventario = rows.map((row) => ({
      id: row.id,
      idProducto: row.idProducto,
      producto: row.producto,
      entraron: Number(row.entraron),
      quedan: Number(row.quedan),
      unidad: row.unidad,
      proveedor: row.proveedor,
      minimo: Number(row.minimo),
      fechaUltimoIngreso: row.fechaUltimoIngreso,
      observaciones: row.observaciones,
      bajoStock: row.bajoStock,
    }));

    return res.status(200).json({
      ok: true,
      inventario,
    });
  } catch (error) {
    console.error("Error en getInventory:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error al obtener inventario",
    });
  }
};
