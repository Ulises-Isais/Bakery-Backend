/**
 * Queries para el módulo de cierre de despacho.
 *
 * Estas consultas obtienen la información necesaria para reconstruir
 * el movimiento de productos durante un turno:
 *
 *   Conteo inicial
 *   + Ingresos
 *   - Sobrante
 *   - Consumo interno
 *   - Conteo final
 *   = Cantidad vendida
 */

/**
 * Verifica si ya existe un cierre para una fecha y turno.
 *
 * La restricción UNIQUE(fecha, turno) también protege esto
 * directamente desde MySQL, pero hacemos la consulta previamente
 * para poder devolver un mensaje más claro desde el backend.
 */

export const GET_EXISTING_CLOSING = `
    SELECT
        id_cierre,
        fecha,
        turno,
        id_usuario_trabajadora,
        id_usuario_cierre,
        venta_calculada,
        dinero_esperado,
        dinero_entregado,
        diferencia,
        estado,
        creado_en,
        cerrado_en
    FROM cierre_despacho
    WHERE fecha = ?
      AND turno = ?
    LIMIT 1
`;

/**
 *
 * Obtener el conteo inicial realizado por la trabajadora.
 * detalle_conteo_despacho solamente almacena los IDs de categoría
 * y producto, por lo que los nombres se obtienen mediante JOIN.
 * LEFT JOIN en productos permite que id_producto sea NULL,
 * como sucede con Bolillo, que se maneja directamente por categoría.
 */
export const GET_INITIAL_COUNT = `
    SELECT
        cd.id_detalle,
        cd.id_conteo,
        c.fecha,
        c.turno,
        c.tipo_conteo,
        c.id_usuario,

        cd.id_categoria,
        cat.nombre AS categoria,

        cd.id_producto,
        p.nombre AS producto,

        cd.cantidad

    FROM detalle_conteo_despacho cd

    INNER JOIN conteos_despacho c
        ON c.id_conteo = cd.id_conteo

    INNER JOIN categorias cat
        ON cat.id_categoria = cd.id_categoria

    LEFT JOIN productos p
        ON p.id_producto = cd.id_producto

    WHERE c.fecha = ?
      AND c.turno = ?
      AND c.tipo_conteo = 'trabajador_inicial'

    ORDER BY
        cd.id_categoria,
        cd.id_producto
`;
/**
 * Obtiene los ingresos confirmados registrados por el administrador.
 *
 * Los ingresos pueden venir:
 *
 *   - por categoría
 *   - por producto
 *
 * Por ejemplo:
 *
 *   Pieza / Polvorón Grande / 20
 *   Pieza / Empanada      / 10
 *
 * Posteriormente el controller decidirá cómo agruparlos
 * para calcular la existencia.
 */

export const GET_CONFIRMED_INCOME_MOVEMENTS = `
    SELECT
        md.id_movimiento,
        md.fecha,
        md.turno,
        md.tipo_movimiento,
        md.id_categoria,
        c.nombre AS categoria,
        md.id_producto,
        p.nombre AS producto,
        md.cantidad,
        md.estado,
        md.id_usuario
    FROM movimientos_despacho md
    INNER JOIN categorias c
        ON c.id_categoria = md.id_categoria
    LEFT JOIN productos p
        ON p.id_producto = md.id_producto
    WHERE md.fecha = ?
      AND md.turno = ?
      AND md.tipo_movimiento = 'ingreso'
      AND md.estado = 'confirmado'
    ORDER BY
        md.id_categoria,
        md.id_producto,
        md.id_movimiento
`;

/**
 * Obtiene los movimientos confirmados que descuentan producto.
 *
 * Incluye:
 *
 *   sobrante
 *   consumo_interno
 *
 * Los movimientos pendientes NO se consideran en el cálculo.
 *
 * El administrador debe revisar estos movimientos antes de que
 * puedan afectar el cierre definitivo.
 */

export const GET_CONFIRMED_ADJUSTMENT_MOVEMENTS = `
    SELECT
        md.id_movimiento,
        md.fecha,
        md.turno,
        md.tipo_movimiento,
        md.id_categoria,
        c.nombre AS categoria,
        md.id_producto,
        p.nombre AS producto,
        md.cantidad,
        md.estado,
        md.id_usuario,
        md.id_usuario_revision,
        md.revisado_en
    FROM movimientos_despacho md
    INNER JOIN categorias c
        ON c.id_categoria = md.id_categoria
    LEFT JOIN productos p
        ON p.id_producto = md.id_producto
    WHERE md.fecha = ?
      AND md.turno = ?
      AND md.tipo_movimiento IN (
          'sobrante',
          'consumo_interno'
      )
      AND md.estado = 'confirmado'
    ORDER BY
        md.id_categoria,
        md.id_producto,
        md.tipo_movimiento,
        md.id_movimiento
`;

/**
 * Obtiene movimientos pendientes de revisión.
 *
 * Esta consulta NO se utilizará para calcular vendido.
 *
 * Su objetivo será permitir que el controller detecte
 * si existen movimientos que el administrador todavía
 * no ha confirmado antes de permitir el cierre.
 */
export const GET_PENDING_MOVEMENTS = `
    SELECT
        md.id_movimiento,
        md.fecha,
        md.turno,
        md.tipo_movimiento,
        md.id_categoria,
        c.nombre AS categoria,
        md.id_producto,
        p.nombre AS producto,
        md.cantidad,
        md.id_usuario
    FROM movimientos_despacho md
    INNER JOIN categorias c
        ON c.id_categoria = md.id_categoria
    LEFT JOIN productos p
        ON p.id_producto = md.id_producto
    WHERE md.fecha = ?
      AND md.turno = ?
      AND md.estado = 'pendiente'
    ORDER BY
        md.id_categoria,
        md.id_producto,
        md.id_movimiento
`;

/**
 * Obtener el conteo final realizado por la trabajadora.
 * Se utiliza la misma estructura que el conteo inicial.
 * El tipo de conteo cambia a trabajador_final.
 */

export const GET_FINAL_COUNT = `
    SELECT
        cd.id_detalle,
        cd.id_conteo,
        c.fecha,
        c.turno,
        c.tipo_conteo,
        c.id_usuario,

        cd.id_categoria,
        cat.nombre AS categoria,

        cd.id_producto,
        p.nombre AS producto,

        cd.cantidad

    FROM detalle_conteo_despacho cd

    INNER JOIN conteos_despacho c
        ON c.id_conteo = cd.id_conteo

    INNER JOIN categorias cat
        ON cat.id_categoria = cd.id_categoria

    LEFT JOIN productos p
        ON p.id_producto = cd.id_producto

    WHERE c.fecha = ?
      AND c.turno = ?
      AND c.tipo_conteo = 'trabajador_final'

    ORDER BY
        cd.id_categoria,
        cd.id_producto
`;

/**
 * Obtiene los precios necesarios para calcular el importe monetario del cierre
 *
 */

export const GET_DISPATCH_PRICES = `
    SELECT
        p.id_producto,
        p.id_categoria,
        c.nombre AS categoria,
        p.nombre AS producto,
        p.precio
    FROM productos p
    INNER JOIN categorias c
        ON c.id_categoria = p.id_categoria
    ORDER BY
        p.id_categoria,
        p.id_producto
`;
/**
 *
 * @param {*}
 * @returns Registra el cierre definitivo de un turno de despacho.
 */
export const INSERT_DISPATCH_CLOSING = `
    INSERT INTO cierre_despacho (
        fecha,
        turno,
        id_usuario_trabajadora,
        id_usuario_cierre,
        venta_calculada,
        dinero_esperado,
        dinero_entregado,
        diferencia,
        estado
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

/**
 *
 * @param {*} fecha
 * @param {*} turno
 * @returns Obtiene los pedidos activos que serán entregados
 * durante el turno junto con el total pagado y el saldo pendiente.
 */
export const GET_DISPATCH_ORDERS = `
    SELECT
        pd.id_pedido,
        pd.fecha,
        pd.turno,
        pd.fecha_entrega,
        pd.hora_entrega,
        pd.total AS total_pedido,

        COALESCE(SUM(ppd.monto), 0) AS total_pagado,

        pd.total - COALESCE(SUM(ppd.monto), 0) AS saldo_pendiente

    FROM pedidos_despacho pd

    LEFT JOIN pagos_pedido_despacho ppd
        ON ppd.id_pedido = pd.id_pedido

    WHERE pd.fecha_entrega = ?
      AND pd.turno = ?
      AND pd.estado = 'activo'

    GROUP BY
        pd.id_pedido,
        pd.fecha,
        pd.turno,
        pd.fecha_entrega,
        pd.hora_entrega,
        pd.total

    ORDER BY
        pd.hora_entrega,
        pd.id_pedido
`;

/**
 *
 * @param {*} fecha
 * @param {*} turno
 * @returns Obtiene los pagos de pedidos registrados durante
 * un turno específico.
 */
export const GET_ORDER_PAYMENTS = `
    SELECT
        ppd.id_pago,
        ppd.id_pedido,
        ppd.monto,
        ppd.id_usuario,
        ppd.creado_en

    FROM pagos_pedido_despacho ppd

    WHERE DATE(ppd.creado_en) = ?

      AND (
            (
                ? = 'mañana'
                AND TIME(ppd.creado_en) >= '06:00:00'
                AND TIME(ppd.creado_en) < '14:00:00'
            )

            OR

            (
                ? = 'tarde'
                AND TIME(ppd.creado_en) >= '14:00:00'
                AND TIME(ppd.creado_en) < '22:00:00'
            )
      )

    ORDER BY
        ppd.creado_en,
        ppd.id_pago
`;

/**
 *
 */
export const GET_CONFIRMED_EXPENSES = `
  SELECT
    gd.id_gasto,
    gd.fecha,
    gd.turno,
    gd.concepto,
    gd.monto,
    gd.id_usuario,
    gd.estado
  FROM gastos_despacho gd
  WHERE gd.fecha = ?
    AND gd.turno = ?
    AND gd.estado = 'confirmado'
  ORDER BY gd.id_gasto
`;

export const GET_PENDING_EXPENSES = `
  SELECT
    gd.id_gasto,
    gd.fecha,
    gd.turno,
    gd.concepto,
    gd.monto,
    gd.id_usuario,
    gd.estado
  FROM gastos_despacho gd
  WHERE gd.fecha = ?
    AND gd.turno = ?
    AND gd.estado = 'pendiente'
  ORDER BY gd.id_gasto
`;

/**
 *
 * @returns Obtiene las entregas de dinero realizadas durante
 * un turno específico.
 */
export const GET_CASH_DELIVERIES = `
    SELECT
        evd.id_entrega,
        evd.fecha_venta,
        evd.fecha_entrega,
        evd.turno,
        evd.monto_entregado,
        evd.id_usuario_entrega,
        evd.id_usuario_recibe,
        evd.estado,
        evd.observaciones,
        evd.creado_en
    FROM entregas_venta_despacho evd
    WHERE evd.fecha_venta = ?
      AND evd.turno = ?
      AND evd.estado = 'confirmado'
    ORDER BY
        evd.id_entrega
`;
