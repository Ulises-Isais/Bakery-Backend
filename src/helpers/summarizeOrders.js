/**
 *
 * @param {*} orders
 * @returns Calcula los totales monetarios de los pedidos entregados
 */
export const summarizeOrders = (orders) => {
  const summary = orders.reduce(
    (totals, order) => {
      totals.totalPedidos += Number(order.total_pedido);

      totals.totalPagadoPedidos += Number(order.total_pagado);

      totals.totalPendientePedidos += Number(order.saldo_pendiente);

      return totals;
    },
    { totalPedidos: 0, totalPagadoPedidos: 0, totalPendientePedidos: 0 },
  );
  return summary;
};
