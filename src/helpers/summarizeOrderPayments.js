/**
 *
 * @param {*} orderPayments
 * @returns Calcula el total de dinero recibido por pagos de pedidos
 */
export const summarizeOrderPayments = (orderPayments) => {
  const dineroRecibidoPedidos = orderPayments.reduce(
    (total, payment) => total + Number(payment.monto),
    0,
  );

  return { dineroRecibidoPedidos };
};
