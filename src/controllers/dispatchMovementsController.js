import { response } from "express";
import { resolverTurno } from "../helpers/resolverTurno.js";
import {
  confirmMovement,
  getPendingMovements,
  rejectMovement,
} from "../services/dispatchMovement.service.js";

export const getPendingMovementsController = async (req, res = response) => {
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

    const { pendingMovements } = await getPendingMovements(fecha, turno);

    return res.status(200).json({
      ok: true,
      msg: "Se obtuvieron los movimientos pendientes",
      pendingMovements,
    });
  } catch (error) {
    console.error("Error en getPendingMovementsController:", error);

    res.status(500).json({
      ok: false,
      msg: "Error interno en el servidor",
    });
  }
};

export const confirmMovementController = async (req, res = response) => {
  try {
    const { idMovimiento } = req.body;
    const idUsuarioRevision = req.uid;

    if (!idMovimiento) {
      return res.status(400).json({
        ok: false,
        msg: "El id del movimiento es obligatorio",
      });
    }

    const movement = await confirmMovement(idMovimiento, idUsuarioRevision);

    return res.status(200).json({
      ok: true,
      msg: "Movimiento confirmado correctamente",
      movement,
    });
  } catch (error) {
    console.error("Error en confirmMovementController:", error);

    return res.status(error.statusCode || 500).json({
      ok: false,
      msg: error.statusCode ? error.message : "Error interno en el servidor",
    });
  }
};

export const rejectMovementController = async (req, res = response) => {
  try {
    const { idMovimiento } = req.body;
    const idUsuarioRevision = req.uid;

    if (!idMovimiento) {
      return res.status(400).json({
        ok: false,
        msg: "El id del movimiento es obligatorio",
      });
    }

    const movement = await rejectMovement(idMovimiento, idUsuarioRevision);

    return res.status(200).json({
      ok: true,
      msg: "Movimiento rechazado correctamente",
      movement,
    });
  } catch (error) {
    console.error("Error en rejectMovementController:", error);

    return res.status(error.statusCode || 500).json({
      ok: false,
      msg: error.statusCode ? error.message : "Error interno en el servidor",
    });
  }
};
