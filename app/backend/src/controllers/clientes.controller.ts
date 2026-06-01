import { Request, Response } from 'express';
import sequelize from '../config/sequelize';
import { executeInRoleTransaction } from '../config/roleExecutor';
import { Cliente } from '../models/Cliente';

// ==========================================
// 1. Buscar un cliente por NIT (ORM)
// ==========================================
export const buscarClientePorNit = async (req: Request, res: Response): Promise<any> => {
    const { nit } = req.params;
    const idRol = req.user?.id_rol;

    try {
        const cliente = await executeInRoleTransaction(idRol, async (t) => {
            return await Cliente.findOne({
                where: { nit_cliente: nit },
                transaction: t
            });
        });

        if (!cliente) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }

        res.json(cliente);
    } catch (error: any) {
        console.error('Error al buscar cliente:', error);
        const isPermissionError = error.parent?.code === '42501';
        res.status(isPermissionError ? 403 : 500).json({
            mensaje: isPermissionError
                ? 'Acceso denegado: Permisos insuficientes en la base de datos (DBMS)'
                : 'Error interno al buscar el cliente'
        });
    }
};

// ==========================================
// 2. Crear o actualizar un cliente (Stored Procedure)
// ==========================================
export const crearCliente = async (req: Request, res: Response): Promise<any> => {
    const { nombre_cliente, correo_cliente, nit_cliente } = req.body;
    const idRol = req.user?.id_rol;

    try {
        const cliente = await executeInRoleTransaction(idRol, async (t) => {
            // Invocar el stored procedure sp_crear_cliente
            const [spResult]: any = await sequelize.query(
                'CALL sp_crear_cliente(?, ?, ?, ?)',
                {
                    replacements: [nombre_cliente, correo_cliente || null, nit_cliente, null],
                    transaction: t
                }
            );
            const id_cliente = spResult?.p_id_cliente;

            // Retornar el cliente resultante usando el ORM
            return await Cliente.findByPk(id_cliente, { transaction: t });
        });

        res.status(201).json({
            mensaje: 'Cliente procesado exitosamente',
            cliente
        });
    } catch (error: any) {
        console.error('Error al crear/actualizar cliente:', error);
        const isPermissionError = error.parent?.code === '42501';
        res.status(isPermissionError ? 403 : 500).json({
            mensaje: isPermissionError
                ? 'Acceso denegado: Permisos de escritura insuficientes en la base de datos (DBMS)'
                : 'Error al procesar el cliente'
        });
    }
};
