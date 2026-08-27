/**
 *
 * @param {*} item
 * @returns Genera la llave utilizada para identificar
 * una venta dentro del cierre de despacho
 */

export const getDispatchProductKey = (item) => {
  if (item.id_categoria === 8) {
    return `${item.id_categoria}-${item.id_producto}`;
  }

  return `${item.id_categoria}-categoria`;
};
