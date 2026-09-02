/**
 *
 * @param {*} totalVenta
 * @param {*} dineroRecibidoPedidos
 * @param {*} totalGastos
 * @returns Calcula el dinero esperado al finalizar el turno del despacho
 */
export const calculateExpectedCash = (
  totalVenta,
  dineroRecibidoPedidos,
  totalGastos,
) => {
  const dineroEsperado =
    Number(totalVenta) + Number(dineroRecibidoPedidos) - Number(totalGastos);

  return dineroEsperado;
};
