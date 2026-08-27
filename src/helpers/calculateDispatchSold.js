import { getDispatchProductKey } from "./getDispatchProductKey.js";

export const calculateDispatchSold = (
  initialCount,
  incomeMovements,
  adjustmentMovements,
  finalCount,
) => {
  const products = {};

  // Conteo inicial
  for (const item of initialCount) {
    const key = getDispatchProductKey(item);

    if (!products[key]) {
      products[key] = {
        id_categoria: item.id_categoria,
        categoria: item.categoria,
        id_producto: item.id_producto,
        producto: item.producto,
        cantidad_inicial: 0,
        cantidad_ingresada: 0,
        cantidad_movida: 0,
        cantidad_final: 0,
      };
    }
    products[key].cantidad_inicial = item.cantidad;
  }

  // Ingresos
  for (const item of incomeMovements) {
    const key = getDispatchProductKey(item);

    if (!products[key]) {
      products[key] = {
        id_categoria: item.id_categoria,
        categoria: item.categoria,
        id_producto: item.id_producto,
        producto: item.producto,
        cantidad_inicial: 0,
        cantidad_ingresada: 0,
        cantidad_movida: 0,
        cantidad_final: 0,
      };
    }
    products[key].cantidad_ingresada += item.cantidad;
  }

  // Sobrante + consumo interno
  for (const item of adjustmentMovements) {
    const key = getDispatchProductKey(item);

    if (!products[key]) {
      products[key] = {
        id_categoria: item.id_categoria,
        categoria: item.categoria,
        id_producto: item.id_producto,
        producto: item.producto,
        cantidad_inicial: 0,
        cantidad_ingresada: 0,
        cantidad_movida: 0,
        cantidad_final: 0,
      };
    }

    products[key].cantidad_movida += item.cantidad;
  }

  // Conteo final
  for (const item of finalCount) {
    const key = getDispatchProductKey(item);

    if (!products[key]) {
      products[key] = {
        id_categoria: item.id_categoria,
        categoria: item.categoria,
        id_producto: item.id_producto,
        producto: item.producto,
        cantidad_inicial: 0,
        cantidad_ingresada: 0,
        cantidad_movida: 0,
        cantidad_final: 0,
      };
    }

    products[key].cantidad_final += item.cantidad;
  }

  // Calcular vendido

  const soldProducts = Object.values(products).map((item) => ({
    ...item,
    cantidad_vendida:
      item.cantidad_inicial +
      item.cantidad_ingresada -
      item.cantidad_movida -
      item.cantidad_final,
  }));

  return soldProducts;
};
