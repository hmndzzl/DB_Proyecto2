import { Request, Response } from 'express';
import pool from '../config/db';

export const obtenerCategorias = async (_req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT id_categoria, nombre_categoria, descripcion_categoria FROM categoria ORDER BY nombre_categoria ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

export const obtenerProveedores = async (_req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT id_proveedor, nombre_proveedor FROM proveedor ORDER BY nombre_proveedor ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener proveedores:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

export const crearCategoria = async (req: Request, res: Response) => {
    const { nombre_categoria, descripcion_categoria } = req.body;
    try {
        const query = 'INSERT INTO categoria (nombre_categoria, descripcion_categoria) VALUES ($1, $2) RETURNING *';
        const result = await pool.query(query, [nombre_categoria, descripcion_categoria]);
        res.status(201).json({ mensaje: 'Categoría creada', categoria: result.rows[0] });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear la categoría' });
    }
};

export const actualizarCategoria = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nombre_categoria, descripcion_categoria } = req.body;
    try {
        const query = 'UPDATE categoria SET nombre_categoria = $1, descripcion_categoria = $2 WHERE id_categoria = $3 RETURNING *';
        const result = await pool.query(query, [nombre_categoria, descripcion_categoria, id]);
        if (result.rows.length === 0) return res.status(404).json({ mensaje: 'Categoría no encontrada' });
        res.json({ mensaje: 'Categoría actualizada', categoria: result.rows[0] });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar la categoría' });
    }
};

export const eliminarCategoria = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const query = 'DELETE FROM categoria WHERE id_categoria = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) return res.status(404).json({ mensaje: 'Categoría no encontrada' });
        res.json({ mensaje: 'Categoría eliminada' });
    } catch (error) {
        res.status(500).json({ mensaje: 'No se puede eliminar la categoría. Asegúrese de que no tenga productos asociados.' });
    }
};