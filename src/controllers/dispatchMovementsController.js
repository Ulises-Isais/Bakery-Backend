import { response } from "express";
import { resolverTurno } from "../helpers/resolverTurno.js";
import {
  confirmMovement,
  getPendingMovements,
  registerIncome,
  rejectMovement,
  updateDispatchCount,
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

    return res.status(error.statusCode || 500).json({
      ok: false,
      msg: error.statusCode ? error.message : "Error interno en el servidor",
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

export const registerIncomeController = async (req, res = response) => {
  try {
    const { fecha, turno, idCategoria, idProducto, cantidad, motivo } =
      req.body;

    const idUsuario = req.uid;

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

    if (!idCategoria) {
      return res.status(400).json({
        ok: false,
        msg: "La categoría es obligatoria",
      });
    }

    if (!cantidad || cantidad <= 0) {
      return res.status(400).json({
        ok: false,
        msg: "La cantidad debe ser mayor a 0",
      });
    }

    const movement = await registerIncome(
      fecha,
      turno,
      idCategoria,
      idProducto,
      cantidad,
      motivo,
      idUsuario,
    );

    return res.status(200).json({
      ok: true,
      msg: "Ingreso registrado correctamente",
      movement,
    });
  } catch (error) {
    console.error("Error en registerIncomeController:", error);

    return res.status(error.statusCode || 500).json({
      ok: false,
      msg: error.statusCode ? error.message : "Error interno en el servidor",
    });
  }
};

export const updateDispatchCountController = async (req, res = response) => {
  try {
    const { idDetalle, cantidad } = req.body;

    if (!idDetalle) {
      return res.status(400).json({
        ok: false,
        msg: "El id del detalle es obligatorio",
      });
    }

    if (cantidad === undefined || cantidad === null) {
      return res.status(400).json({
        ok: false,
        msg: "La cantidad es obligatoria",
      });
    }

    if (!Number.isInteger(Number(cantidad)) || Number(cantidad) < 0) {
      return res.status(400).json({
        ok: false,
        msg: "La cantidad debe ser un número mayor o igual a 0",
      });
    }

    const count = await updateDispatchCount(idDetalle, Number(cantidad));

    return res.status(200).json({
      ok: true,
      msg: "Conteo actualizado correctamente",
      count,
    });
  } catch (error) {
    console.error("Error en updateDispatchCountController", error);

    return res.status(error.statusCode || 500).json({
      ok: false,
      msg: error.statusCode ? error.message : "Error interno en el servidor",
    });
  }
};
