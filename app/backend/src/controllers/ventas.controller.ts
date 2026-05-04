import { Request, Response } from 'express';
import pool from '../config/db';

// ==========================================
// CREATE: Registrar una nueva venta
// ==========================================
export const crearVenta = async (req: Request, res: Response): Promise<any> => {
    const { cliente, carrito, id_empleado } = req.body;

    if (!cliente || !cliente.nit || !carrito || carrito.length === 0 || !id_empleado) {
        return res.status(400).json({ mensaje: 'Datos de venta incompletos' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN'); // Inicia la transacción

        // 1. Manejo del Cliente (Buscar o Crear)
        let id_cliente;
        const clienteRes = await client.query('SELECT id_cliente FROM cliente WHERE nit_cliente = $1', [cliente.nit]);
        
        if (clienteRes.rows.length > 0) {
            id_cliente = clienteRes.rows[0].id_cliente;
        } else {
            // Cliente nuevo, lo insertamos
            const nuevoClienteRes = await client.query(
                'INSERT INTO cliente (nombre_cliente, correo_cliente, nit_cliente) VALUES ($1, $2, $3) RETURNING id_cliente',
                [cliente.nombre, cliente.correo || null, cliente.nit]
            );
            id_cliente = nuevoClienteRes.rows[0].id_cliente;
        }

        let totalVenta = 0;
        const itemsAProcesar = [];

        // 2. Validar stock y precios de TODOS los productos antes de insertar
        for (const item of carrito) {
            const productoRes = await client.query(
                'SELECT precio_producto, stock_producto FROM producto WHERE id_producto = $1',
                [item.id_producto]
            );

            if (productoRes.rowCount === 0) {
                throw new Error(`Producto con ID ${item.id_producto} no encontrado`);
            }

            const { precio_producto, stock_producto } = productoRes.rows[0];

            if (stock_producto < item.cantidad) {
                throw new Error(`Stock insuficiente para el producto ID ${item.id_producto}. Disponibles: ${stock_producto}`);
            }

            const subtotal = Number(precio_producto) * item.cantidad;
            totalVenta += subtotal;

            itemsAProcesar.push({
                id_producto: item.id_producto,
                cantidad: item.cantidad,
                precio_unitario: precio_producto,
                subtotal: subtotal
            });
        }

        // 3. Insertar la Venta principal
        const ventaRes = await client.query(
            'INSERT INTO venta (id_cliente, id_empleado, fecha_venta, total_venta) VALUES ($1, $2, NOW(), $3) RETURNING id_venta',
            [id_cliente, id_empleado, totalVenta]
        );
        const id_venta = ventaRes.rows[0].id_venta;

        // 4. Insertar el Detalle de la venta y restar stock para cada producto
        for (const item of itemsAProcesar) {
            await client.query(
                'INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES ($1, $2, $3, $4, $5)',
                [id_venta, item.id_producto, item.cantidad, item.precio_unitario, item.subtotal]
            );

            await client.query(
                'UPDATE producto SET stock_producto = stock_producto - $1 WHERE id_producto = $2',
                [item.cantidad, item.id_producto]
            );
        }

        await client.query('COMMIT'); // Confirmar todos los cambios
        res.status(201).json({ mensaje: 'Venta procesada con éxito', id_venta });

    } catch (error: any) {
        await client.query('ROLLBACK'); // Deshacer todo si algo falló
        console.error('Error en la transacción de venta:', error);
        res.status(400).json({ mensaje: error.message || 'Error al procesar la venta' });
    } finally {
        client.release(); // Liberar la conexión al pool
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