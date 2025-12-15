import { response } from "express";
import pool from "../config/db.js";
import { resolverTurno } from "../helpers/resolverTurno.js";
import { normalizarCortePorTurno } from "../helpers/normalizarCorte.js";

// Mostrar ventas totales del día
export const salesCards = async (req, res = response) => {
  try {
    const turno = resolverTurno(req);
    const { fecha = "2025-09-12" } = req.body || {};

    // Validar que venga la fecha
    if (!fecha) {
      return res.status(400).json({
        ok: false,
        msg: "La fecha es obligatioria",
      });
    }

    let query = `SELECT 
      cc.turno,
      c.nombre AS categoria,
      cc.total_por_categoria
      FROM corte_caja cc
      JOIN categorias c on cc.id_categoria = c.id_categoria
      WHERE cc.fecha = ?
      `;

    const params = [fecha];

    if (turno) {
      query += "AND cc.turno = ?";
      params.push(turno);
    }
    // venta de la mañana
    const [rows] = await pool.query(query, params);

    const corteNormalizado = normalizarCortePorTurno(rows);

    if (rows.length === 0) {
      return res.status(404).json({
        ok: false,
        msg: "No se encontró corte de caja para la fecha indicada",
      });
    }

    res.status(200).json({
      ok: true,
      fecha,
      ...corteNormalizado,
      // totalTarde: afternoon[0].total_tarde,
      // totalGeneral,
    });
  } catch (error) {
    console.error("Error en salesCards:", error);
    res.status(500).json({
      ok: false,
      msg: "Error al obtener ventas",
    });
  }
};

export const salesDespacho = async (req, res = response) => {
  try {
    const { fecha } = req.body;
    const turno = resolverTurno(req);
    // const { fecha = "2025-09-12", turno = "mañana" } = req.body || {};

    // Validar que venga la fecha
    if (!fecha) {
      return res.status(400).json({
        ok: false,
        msg: "La fecha es obligatoria",
      });
    }

    let query = `SELECT
      d.turno,
      c.nombre AS categoria,
      p.nombre AS producto,
      d.cantidad_inicial,
      d.ingreso,
      d.quedan,
      d.vendido,
      d.total
      FROM despacho d
      JOIN productos p ON d.id_producto = p.id_producto
      JOIN categorias c ON p.id_categoria = c.id_categoria
      WHERE d.fecha = ?
      AND d.vendido > 0 `;

    const params = [fecha];

    if (turno) {
      query += "AND d.turno = ?";
      params.push(turno);
    }

    query += "ORDER BY c.nombre ASC, p.nombre ASC";

    const [rows] = await pool.query(query, params);

    return res.status(200).json({
      ok: true,
      despacho: rows,
    });
  } catch (error) {
    console.error("Error en salesDespacho:", error);
    res.status(500).json({
      ok: false,
      msg: "Error al obtener los datos del despacho",
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

// // TODO: HACER LAS VENTAS DEL DESPACHO
// export const salesDespacho = async (req, res = response) => {
//   // Obtener ventas del despacho

//   try {
//   } catch (error) {}
// };

export const generarCorteCaja = async (req, res = response) => {
  try {
    const { fecha } = req.body;
    const turno = resolverTurno(req);
    if (!fecha || !turno) {
      return res.status(400).json({
        ok: false,
        msg: "La fecha y turno son obligatorios",
      });
    }

    // Insertar total_por_categoria
    await pool.query(
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

    // Calcular total_general y actualizar todas las filas de ese corte
    await pool.query(
      `UPDATE corte_caja cc
       JOIN (
         SELECT fecha, turno, SUM(total_por_categoria) AS total_general
         FROM corte_caja
         WHERE fecha = ? AND turno = ?
       ) t
       ON cc.fecha = t.fecha AND cc.turno = t.turno
       SET cc.total_general = t.total_general`,
      [fecha, turno]
    );
    res.json({ ok: true, msg: "Corte de caja generado exitosamente", rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error al generar el corte" });
  }
};

const inventory = () => {};
