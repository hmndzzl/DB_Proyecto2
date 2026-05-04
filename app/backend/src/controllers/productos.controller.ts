import { Request, Response } from 'express';
import pool from '../config/db';

// ==========================================
// 1. READ: Obtener todos los productos
// ==========================================
export const obtenerProductos = async (_req: Request, res: Response) => {
    try {
        // JOIN para traer el nombre de la categoría y del proveedor
        const query = `
      SELECT p.id_producto, p.nombre_producto, p.precio_producto, p.stock_producto, 
             c.nombre_categoria, pr.nombre_proveedor 
      FROM producto p
      JOIN categoria c ON p.id_categoria = c.id_categoria
      JOIN proveedor pr ON p.id_proveedor = pr.id_proveedor
      ORDER BY p.id_producto ASC
    `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// ==========================================
// 2. READ: Obtener un solo producto por ID
// ==========================================
export const obtenerProductoPorId = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM producto WHERE id_producto = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// ==========================================
// 3. CREATE: Crear un nuevo producto
// ==========================================
export const crearProducto = async (req: Request, res: Response) => {
    const { nombre_producto, precio_producto, stock_producto, id_categoria, id_proveedor } = req.body;

    try {
        const query = `
      INSERT INTO producto (nombre_producto, precio_producto, stock_producto, id_categoria, id_proveedor)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `;
        const result = await pool.query(query, [nombre_producto, precio_producto, stock_producto, id_categoria, id_proveedor]);

        res.status(201).json({
            mensaje: 'Producto creado exitosamente',
            producto: result.rows[0]
        });
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ mensaje: 'Error al crear el producto. Verifique los datos enviados.' });
    }
};

// ==========================================
// 4. UPDATE: Actualizar un producto
// ==========================================
export const actualizarProducto = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nombre_producto, precio_producto, stock_producto, id_categoria, id_proveedor } = req.body;

    try {
        const query = `
      UPDATE producto 
      SET nombre_producto = $1, precio_producto = $2, stock_producto = $3, id_categoria = $4, id_proveedor = $5
      WHERE id_producto = $6 RETURNING *
    `;
        const result = await pool.query(query, [nombre_producto, precio_producto, stock_producto, id_categoria, id_proveedor, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Producto no encontrado para actualizar' });
        }

        res.json({ mensaje: 'Producto actualizado', producto: result.rows[0] });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar el producto' });
    }
};

// ==========================================
// 5. DELETE: Eliminar un producto
// ==========================================
export const eliminarProducto = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM producto WHERE id_producto = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Producto no encontrado para eliminar' });
        }

        res.json({ mensaje: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el producto. Podría estar asociado a una venta existente.' });
    }
};