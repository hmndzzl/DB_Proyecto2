import { Request, Response } from 'express';
import pool from '../config/db';

// ==========================================
// CREATE: Registrar una nueva venta (CON TRANSACCIÓN)
// ==========================================
export const crearVenta = async (req: Request, res: Response) => {
    const { id_cliente, total_venta, detalles } = req.body;
    // Extraer el id_empleado que el authMiddleware inyectó con el JWT
    const id_empleado = req.user?.id_empleado;

    const client = await pool.connect();

    try {
        // 1. Iniciar transacción
        await client.query('BEGIN');

        // 2. Insertar la cabecera de la venta
        const insertVentaQuery = `
      INSERT INTO venta (id_cliente, id_empleado, total_venta)
      VALUES ($1, $2, $3) RETURNING id_venta, fecha_venta
    `;
        const resVenta = await client.query(insertVentaQuery, [id_cliente, id_empleado, total_venta]);
        const nuevaVenta = resVenta.rows[0];

        // 3. Insertar los detalles y descontar el stock
        for (const item of detalles) {
            // a) Insertar el detalle
            const insertDetalleQuery = `
        INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario, subtotal)
        VALUES ($1, $2, $3, $4, $5)
      `;
            await client.query(insertDetalleQuery, [
                nuevaVenta.id_venta,
                item.id_producto,
                item.cantidad,
                item.precio_unitario,
                item.subtotal
            ]);

            // b) Descontar el inventario del producto
            const updateStockQuery = `
        UPDATE producto 
        SET stock_producto = stock_producto - $1
        WHERE id_producto = $2
      `;
            await client.query(updateStockQuery, [item.cantidad, item.id_producto]);
        }

        // 4. Confirmar transacción
        await client.query('COMMIT');

        res.status(201).json({
            mensaje: 'Venta registrada exitosamente',
            venta: nuevaVenta
        });

    } catch (error) {
        // 5. Manejo de error y rollback
        await client.query('ROLLBACK');
        console.error('Error en la transacción de venta:', error);
        res.status(500).json({ mensaje: 'Error al procesar la venta. Transacción cancelada (Rollback).' });
    } finally {
        // 6. Liberar el cliente de vuelta al pool
        client.release();
    }
};

// ==========================================
// READ: Obtener historial de ventas para reportes
// ==========================================
export const obtenerVentas = async (_req: Request, res: Response) => {
    try {
        const query = `
      SELECT v.id_venta, v.fecha_venta, v.total_venta, 
             c.nombre_cliente, e.nombre_empleado 
      FROM venta v
      JOIN cliente c ON v.id_cliente = c.id_cliente
      JOIN empleado e ON v.id_empleado = e.id_empleado
      ORDER BY v.fecha_venta DESC
    `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el historial de ventas' });
    }
};