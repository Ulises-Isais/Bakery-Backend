import pool from "../config/db.js";
import { calculateDispatchAmount } from "../helpers/calculateDispatchAmount.js";
import { calculateDispatchSold } from "../helpers/calculateDispatchSold.js";
import {
  GET_CONFIRMED_ADJUSTMENT_MOVEMENTS,
  GET_CONFIRMED_INCOME_MOVEMENTS,
  GET_DISPATCH_ORDERS,
  GET_DISPATCH_PRICES,
  GET_EXISTING_CLOSING,
  GET_FINAL_COUNT,
  GET_INITIAL_COUNT,
  GET_ORDER_PAYMENTS,
  GET_PENDING_MOVEMENTS,
} from "../queries/dispatchClosingQueries.js";

export const closeDispatch = async (fecha, turno, idUsuarioCierre) => {
  const [existingClosing] = await pool.query(GET_EXISTING_CLOSING, [
    fecha,
    turno,
  ]);

  if (existingClosing.length > 0) {
    throw new Error("El turno ya tiene un cierre registrado");
  }

  const [initialCount] = await pool.query(GET_INITIAL_COUNT, [fecha, turno]);

  const [finalCount] = await pool.query(GET_FINAL_COUNT, [fecha, turno]);

  if (initialCount.length === 0) {
    throw new Error("No existe un conteo inicial para este turno");
  }
  if (finalCount.length === 0) {
    throw new Error("No existe un conteo final para este turno");
  }

  // Obtener ingresos confirmados registrados por el administrador
  const [incomeMovements] = await pool.query(GET_CONFIRMED_INCOME_MOVEMENTS, [
    fecha,
    turno,
  ]);

  // Obtener sobrantes y consumo interno confirmados
  const [adjustmentMovements] = await pool.query(
    GET_CONFIRMED_ADJUSTMENT_MOVEMENTS,
    [fecha, turno],
  );

  // Movimientos pendientes
  const [pendingMovements] = await pool.query(GET_PENDING_MOVEMENTS, [
    fecha,
    turno,
  ]);

  // No se permite cerrar el turno mientras existan confirmaciones pendientes
  if (pendingMovements.length > 0) {
    throw new Error("Existen movimientos pendientes de confirmación");
  }

  const soldProducts = calculateDispatchSold(
    initialCount,
    incomeMovements,
    adjustmentMovements,
    finalCount,
  );

  const [prices] = await pool.query(GET_DISPATCH_PRICES);

  const { sales, totalVenta } = calculateDispatchAmount(soldProducts, prices);

  return {
    fecha,
    turno,
    initialCount,
    incomeMovements,
    adjustmentMovements,
    pendingMovements,
    finalCount,
    soldProducts,
    sales,
    totalVenta,
  };
};

/**
 *
 * @returns
 */
export const getDispatchClosingPreview = async (fecha, turno) => {
  // Buscar si ya existe un cierre para esta fecha y turno
  const [existingClosing] = await pool.query(GET_EXISTING_CLOSING, [
    fecha,
    turno,
  ]);

  // Obtener el conteo inicial

  const [initialCount] = await pool.query(GET_INITIAL_COUNT, [fecha, turno]);

  const [incomeMovements] = await pool.query(GET_CONFIRMED_INCOME_MOVEMENTS, [
    fecha,
    turno,
  ]);

  const [adjustmentMovements] = await pool.query(
    GET_CONFIRMED_ADJUSTMENT_MOVEMENTS,
    [fecha, turno],
  );

  const [pendingMovements] = await pool.query(GET_PENDING_MOVEMENTS, [
    fecha,
    turno,
  ]);

  const [finalCount] = await pool.query(GET_FINAL_COUNT, [fecha, turno]);

  // Obtiene los pedidos activos del turno
  const [orders] = await pool.query(GET_DISPATCH_ORDERS, [fecha, turno]);

  // Obtiene los pagos de pedidos registrados durante el día
  const [orderPayments] = await pool.query(GET_ORDER_PAYMENTS, [
    fecha,
    turno,
    turno,
  ]);

  const [prices] = await pool.query(GET_DISPATCH_PRICES);

  const soldProducts = calculateDispatchSold(
    initialCount,
    incomeMovements,
    adjustmentMovements,
    finalCount,
  );

  const { sales, totalVenta } = calculateDispatchAmount(soldProducts, prices);

  return {
    existingClosing,
    initialCount,
    incomeMovements,
    adjustmentMovements,
    pendingMovements,
    finalCount,
    soldProducts,
    sales,
    totalVenta,
    orders,
    orderPayments,
  };
};
