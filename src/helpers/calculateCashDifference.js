/**
 *
 * @param {*} dineroEsperado
 * @param {*} dineroEntregado
 * @returns Calcula la diferencia entre el dinero esperado y el dinero entregado
 */
export const calculateCashDifference = (dineroEsperado, dineroEntregado) => {
  return Number(dineroEsperado) - Number(dineroEntregado);
};
