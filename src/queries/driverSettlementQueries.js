/**
 * Queries para el módulo cierre de repartidor
 */

// Insertar devoluciones
export const INSERT_DEVOLUCION = `
    INSERT INTO devoluciones(
id_devolucion,
id_repartidor,
id_categoria ,
fecha,
cantidad_devuelta,
cantidad_cambios ,
dinero_cambios ,
dinero_regresos,
extra
)
VALUES (?, ?, ?, ?, ?, ?, ?, ? )
`;

// Actualizar venta
export const UPDATE_SALE = `
UPDATE ventas
SET
    total= ?,
    dinero_pendiente = ?,
    notas = ?
WHERE
    id_repartidor = ?
    AND fecha = ?        
    `;
