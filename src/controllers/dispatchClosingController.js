import { response } from "express";
import pool from "../config/db.js";

import { resolverTurno } from "../helpers/resolverTurno.js";

import { GET_EXISTING_CLOSING } from "../queries/dispatchClosingQueries.js";

export const previewDispatchClosing = async (req, res = response) => {
  try {
    const { fecha } = req.body;

    const turno = resolverTurno(req);
    if (!fecha) {
      return res.status(400).json({
        ok: false,
        msg: "La fecha es obligatoria",
      });
    }

    if (!turno) {
      return res.status(400).json({
        ok: false,
        msg: "El turno es obligatorio",
      });
    }

    // Buscar si ya existe un cierre para esta fecha y turno
    const [existingClosing] = await pool.query(GET_EXISTING_CLOSING, [
      fecha,
      turno,
    ]);
    console.log("existingClosing", existingClosing);

    return res.status(200).json({
      ok: true,
      msg: "Preview de cierre recibido correctamente",
      fecha,
      turno,
      usuario: req.uid,
      role: req.role,
      existingClosing,
    });
  } catch (error) {
    console.error("Error en previewDispatchClosing", error);

    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
    });
  }
};
