import pool from "../config/db.js";
import { AppError } from "../helpers/AppError.js";
import {
  CONFIRM_MOVEMENT,
  GET_PENDING_MOVEMENTS,
  REJECT_MOVEMENT,
} from "../queries/dispatchClosingQueries.js";

export const confirmMovement = async (idMovimiento, idUsuarioRevision) => {
  const [result] = await pool.query(CONFIRM_MOVEMENT, [
    idUsuarioRevision,
    idMovimiento,
  ]);

  if (result.affectedRows === 0) {
    throw new AppError("No se pudo ejecutar la confirmación", 409);
  }

  return {
    idMovimiento,
    idUsuarioRevision,
  };
};

export const rejectMovement = async (idMovimiento, idUsuarioRevision) => {
  const [result] = await pool.query(REJECT_MOVEMENT, [
    idUsuarioRevision,
    idMovimiento,
  ]);

  if (result.affectedRows === 0) {
    throw new AppError("No se pudo ejecutar el rechazo", 409);
  }

  return {
    idMovimiento,
    idUsuarioRevision,
  };
};

export const getPendingMovements = async (fecha, turno) => {
  const [pendingMovements] = await pool.query(GET_PENDING_MOVEMENTS, [
    fecha,
    turno,
  ]);

  return { pendingMovements };
};
