import { Request, Response } from 'express';
import pool from '../config/db';

export const obtenerCategorias = async (_req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT id_categoria, nombre_categoria FROM categoria ORDER BY nombre_categoria ASC');
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