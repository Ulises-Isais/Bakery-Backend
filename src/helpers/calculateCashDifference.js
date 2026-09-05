/**
 *
 * @param {*} expected
 * @param {*} delivered
 * @param {*} existsDelivery
 * @returns Calcula la diferencia entre el dinero esperado y el dinero entregado
 */
export const calculateCashDifference = (
  expected,
  delivered,
  existsDelivery,
) => {
  if (!existsDelivery) {
    return null;
  }
  return expected - delivered;
};
