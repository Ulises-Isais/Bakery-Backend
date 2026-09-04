import pool from "../config/db.js";

import {
  calculateCashDifference,
  calculateDispatchAmount,
  calculateDispatchSold,
  calculateExpectedCash,
  summarizeCashDeliveries,
  summarizeExpenses,
  summarizeOrderPayments,
  summarizeOrders,
} from "../helpers/index.js";
import {
  GET_CASH_DELIVERIES,
  GET_CONFIRMED_ADJUSTMENT_MOVEMENTS,
  GET_CONFIRMED_EXPENSES,
  GET_CONFIRMED_INCOME_MOVEMENTS,
  GET_DISPATCH_ORDERS,
  GET_DISPATCH_PRICES,
  GET_EXISTING_CLOSING,
  GET_FINAL_COUNT,
  GET_INITIAL_COUNT,
  GET_ORDER_PAYMENTS,
  GET_PENDING_EXPENSES,
  GET_PENDING_MOVEMENTS,
  INSERT_DISPATCH_CLOSING,
} from "../queries/dispatchClosingQueries.js";

/**
 *
 * @param {*} fecha Fecha correspondiente al cierre del despacho.
 * @param {*} turno Turno que desea cerrar.
 * @param {*} idUsuarioCierre  Usuario administrador que registra el ciere.
 * @returns Valida la información del turno y prepara el ciere definitivo del despacho.
 */
export const closeDispatch = async (fecha, turno, idUsuarioCierre) => {
  const data = await getDispatchClosingData(fecha, turno);

  const {
    existingClosing,
    initialCount,
    finalCount,
    pendingExpenses,
    pendingMovements,
    totalVenta,
    dineroEsperado,
    dineroEntregado,
    diferencia,
  } = data;

  if (existingClosing.length > 0) {
    throw new Error("El turno ya tiene un cierre registrado");
  }
  if (initialCount.length === 0) {
    throw new Error("No existe un conteo inicial para este turno");
  }
  if (finalCount.length === 0) {
    throw new Error("No existe un conteo final para este turno");
  }

  // No se permite cerrar el turno mientras existan confirmaciones pendientes
  if (pendingMovements.length > 0) {
    throw new Error("Existen movimientos pendientes de confirmación");
  }

  if (pendingExpenses.length > 0) {
    throw new Error("Existen gastos pendientes de confirmación");
  }

  const [result] = await pool.query(INSERT_DISPATCH_CLOSING, [
    fecha,
    turno,
    initialCount[0].id_usuario,
    idUsuarioCierre,
    totalVenta,
    dineroEsperado,
    dineroEntregado,
    diferencia,
    "cerrado",
  ]);

  const idUsuarioTrabajadora = initialCount[0].id_usuario;

  const { insertId } = result;

  return {
    insertId,
    fecha,
    turno,
    idUsuarioTrabajadora,
    idUsuarioCierre,
    totalVenta,
    dineroEntregado,
    dineroEsperado,
    diferencia,
  };
};

/**
 *
 * @param {*} fecha Fecha del turno que se desea consultar.
 * @param {*} turno Turno que desea consultar.
 * @returns Obtiene la información actual del cierre de despacho para mostrar una vista previa sin registrar el cierre.
 */
export const getDispatchClosingPreview = async (fecha, turno) => {
  const data = await getDispatchClosingData(fecha, turno);

  return data;
};

/**
 *
 * @param {*} fecha Fecha correspondiente al turno de despacho.
 * @param {*} turno Turno del despacho que se desea consultar.
 * @returns Obtiene y calcula toda la información necesaria para realizar
 * el cierre de un turno de despacho.
 */
const getDispatchClosingData = async (fecha, turno) => {
  // Buscar si ya existe un cierre para esta fecha y turno
  const [existingClosing] = await pool.query(GET_EXISTING_CLOSING, [
    fecha,
    turno,
  ]);

  // Obtener el conteo inicial

  const [initialCount] = await pool.query(GET_INITIAL_COUNT, [fecha, turno]);

  // Obtiene los movimientos de ingreso
  const [incomeMovements] = await pool.query(GET_CONFIRMED_INCOME_MOVEMENTS, [
    fecha,
    turno,
  ]);

  // Obtiene los movimientos de ajuste dentro del despacho
  const [adjustmentMovements] = await pool.query(
    GET_CONFIRMED_ADJUSTMENT_MOVEMENTS,
    [fecha, turno],
  );

  // Movimientos pendientes de confirmar en despacho
  const [pendingMovements] = await pool.query(GET_PENDING_MOVEMENTS, [
    fecha,
    turno,
  ]);

  // Conteo final de despacho
  const [finalCount] = await pool.query(GET_FINAL_COUNT, [fecha, turno]);

  // Obtiene los pedidos activos del turno
  const [orders] = await pool.query(GET_DISPATCH_ORDERS, [fecha, turno]);

  // Resumen de pedidos por turno
  const ordersSummary = summarizeOrders(orders);

  // Obtiene los pagos de pedidos registrados durante el día
  const [orderPayments] = await pool.query(GET_ORDER_PAYMENTS, [
    fecha,
    turno,
    turno,
  ]);

  // Resumen de pagos de pedidos registrados durante el dia
  const orderPaymentSummary = summarizeOrderPayments(orderPayments);

  // Obtiene precios del despacho
  const [prices] = await pool.query(GET_DISPATCH_PRICES);

  // Calcula lo vendido durante el turno
  const soldProducts = calculateDispatchSold(
    initialCount,
    incomeMovements,
    adjustmentMovements,
    finalCount,
  );

  const { sales, totalVenta } = calculateDispatchAmount(soldProducts, prices);
  // Gastos confirmados dentro de despacho
  const [confirmedExpenses] = await pool.query(GET_CONFIRMED_EXPENSES, [
    fecha,
    turno,
  ]);
  // Gastos pendientes de confirmar durante el turno
  const [pendingExpenses] = await pool.query(GET_PENDING_EXPENSES, [
    fecha,
    turno,
  ]);
  // Resumen de gastos
  const expenseSummary = summarizeExpenses(confirmedExpenses);

  // Calcula el dinero esperado al finalizar turno
  const dineroEsperado = calculateExpectedCash(
    totalVenta,
    orderPaymentSummary.dineroRecibidoPedidos,
    expenseSummary.totalGastos,
  );

  // Obtiene el dinero entregado del turno
  const [cashDeliveries] = await pool.query(GET_CASH_DELIVERIES, [
    fecha,
    turno,
  ]);

  // Resumen de dinero entregado
  const cashDeliverySummary = summarizeCashDeliveries(cashDeliveries);

  const dineroEntregado = cashDeliverySummary.dineroEntregado;

  const diferencia = calculateCashDifference(dineroEsperado, dineroEntregado);
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
    orderPaymentSummary,
    ordersSummary,

    confirmedExpenses,
    expenseSummary,
    pendingExpenses,
    dineroEsperado,

    cashDeliveries,
    cashDeliverySummary,
    dineroEntregado,
    diferencia,
  };
};
