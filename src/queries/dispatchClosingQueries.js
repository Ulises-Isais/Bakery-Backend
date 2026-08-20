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
 * Obtiene el conteo inicial realizado por la trabajadora.
 *
 * Solamente buscamos:
 *
 *   tipo_conteo = trabajador_inicial
 *
 * El detalle contiene la cantidad inicial por categoría
 * y, cuando corresponde, por producto.
 */
export const GET_INITIAL_COUNT = `
    SELECT
        cd.id_detalle,
        cd.id_conteo,
        c.fecha,
        c.turno,
        c.tipo_conteo,
        c.id_usuario,
        cd.categoria,
        cd.id_producto,
        cd.producto,
        cd.cantidad
    FROM detalle_conteo_despacho cd
    INNER JOIN conteos_despacho c
        ON c.id_conteo = cd.id_conteo
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
 * Obtiene el conteo final realizado por la trabajadora.
 *
 * El conteo final utiliza el mismo formato que el conteo inicial
 * de la trabajadora:
 *
 *   Bolillo -> categoría
 *   Pieza   -> categoría
 *   Refri   -> producto
 *
 * No intentamos calcular todavía la venta aquí.
 * Solamente obtenemos el dato físico registrado.
 */
export const GET_FINAL_COUNT = `
    SELECT
        cd.id_detalle,
        cd.id_conteo,
        c.fecha,
        c.turno,
        c.tipo_conteo,
        c.id_usuario,
        cd.categoria,
        cd.id_producto,
        cd.producto,
        cd.cantidad
    FROM detalle_conteo_despacho cd
    INNER JOIN conteos_despacho c
        ON c.id_conteo = cd.id_conteo
    WHERE c.fecha = ?
      AND c.turno = ?
      AND c.tipo_conteo = 'trabajador_final'
    ORDER BY
        cd.id_categoria,
        cd.id_producto
`;
