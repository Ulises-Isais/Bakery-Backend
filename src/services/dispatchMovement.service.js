import pool from "../config/db.js";
import { AppError } from "../helpers/AppError.js";
import {
  CONFIRM_MOVEMENT,
  GET_PENDING_MOVEMENTS,
  INSERT_INCOME_MOVEMENT,
  REJECT_MOVEMENT,
  UPDATE_DISPATCH_COUNT,
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

export const registerIncome = async (
  fecha,
  turno,
  idCategoria,
  idProducto,
  cantidad,
  motivo,
  idUsuario,
) => {
  const [result] = await pool.query(INSERT_INCOME_MOVEMENT, [
    fecha,
    turno,
    idCategoria,
    idProducto,
    cantidad,
    motivo,
    idUsuario,
  ]);

  if (result.affectedRows === 0) {
    throw new AppError("No se pudo registrar el ingreso", 409);
  }

  return {
    idMovimiento: result.insertId,
    fecha,
    turno,
    idCategoria,
    idProducto,
    cantidad,
    motivo,
    idUsuario,
  };
};

export const updateDispatchCount = async (idDetalle, cantidad) => {
  const [result] = await pool.query(UPDATE_DISPATCH_COUNT, [
    cantidad,
    idDetalle,
  ]);

  if (result.affectedRows === 0) {
    throw new AppError(
      "No se encontró el conteo o no puede ser modificado",
      404,
    );
  }
  return {
    idDetalle,
    cantidad,
  };
};
