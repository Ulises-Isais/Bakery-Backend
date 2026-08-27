import { getDispatchProductKey } from "./getDispatchProductKey.js";

/**
 *
 * @param {*} soldProducts
 * @param {*} prices
 * @returns Calcula el importe monetario de los productos vendidos
 * durante el cierre de despacho.
 */
export const calculateDispatchAmount = (soldProducts, prices) => {
  const pricesByKey = {};

  for (const item of prices) {
    const key = getDispatchProductKey(item);

    if (!pricesByKey[key]) {
      pricesByKey[key] = Number(item.precio);
    }
  }

  const sales = soldProducts.map((item) => {
    const key = getDispatchProductKey(item);

    const precioUnitario = pricesByKey[key] ?? 0;

    const importe = item.cantidad_vendida * precioUnitario;

    return {
      ...item,
      precio_unitario: precioUnitario,
      importe,
    };
  });

  const totalVenta = sales.reduce((total, item) => total + item.importe, 0);

  return {
    sales,
    totalVenta,
  };
};
