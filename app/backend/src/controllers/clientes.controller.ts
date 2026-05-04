import { Request, Response } from 'express';
import pool from '../config/db';

export const buscarClientePorNit = async (req: Request, res: Response): Promise<any> => {
    const { nit } = req.params;

    try {
        const query = 'SELECT id_cliente, nombre_cliente, correo_cliente, nit_cliente FROM cliente WHERE nit_cliente = $1';
        const result = await pool.query(query, [nit]);

        if (result.rowCount === 0) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al buscar cliente:', error);
        res.status(500).json({ mensaje: 'Error interno al buscar el cliente' });
    }
};
