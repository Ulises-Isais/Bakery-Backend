/**
 *
 * @param {*} cashDeliveries
 * @returns Calcula el total de dinero entregado durante el turno
 */
export const summarizeCashDeliveries = (cashDeliveries) => {
  const dineroEntregado = cashDeliveries.reduce(
    (total, delivery) => total + Number(delivery.monto_entregado),
    0,
  );

  return { dineroEntregado, existeEntrega: cashDeliveries.length > 0 };
};
