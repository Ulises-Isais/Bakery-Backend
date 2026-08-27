import { response } from "express";

import { resolverTurno } from "../helpers/resolverTurno.js";
import { getDispatchClosingPreview } from "../services/dispatchClosing.service.js";

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns Obtiene la información necesaria para mostrar el preview
 */
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
    const closing = await getDispatchClosingPreview(fecha, turno);
    return res.status(200).json({
      ok: true,
      msg: "Preview de cierre recibido correctamente",
      fecha,
      turno,
      usuario: req.uid,
      role: req.role,
      closing,
    });
  } catch (error) {
    console.error("Error en previewDispatchClosing", error);

    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
    });
  }
};
