import { Request, Response } from 'express';
import sequelize from '../config/sequelize';
import { executeInRoleTransaction } from '../config/roleExecutor';

// ==========================================
// CREATE: Registrar una nueva venta (Stored Procedure Transaccional)
// ==========================================
export const crearVenta = async (req: Request, res: Response): Promise<any> => {
    const { cliente, carrito, id_empleado } = req.body;
    const idRol = req.user?.id_rol;

    if (!cliente || !cliente.nit || !carrito || carrito.length === 0 || !id_empleado) {
        return res.status(400).json({ mensaje: 'Datos de venta incompletos' });
    }

    try {
        const id_venta = await executeInRoleTransaction(idRol, async (t) => {
            // 1. Crear o recuperar cliente usando el stored procedure sp_crear_cliente
            const [spClienteResult]: any = await sequelize.query(
                'CALL sp_crear_cliente(?, ?, ?, ?)',
                {
                    replacements: [cliente.nombre, cliente.correo || null, cliente.nit, null],
                    transaction: t
                }
            );
            const id_cliente = spClienteResult?.p_id_cliente;

            if (!id_cliente) {
                throw new Error('No se pudo determinar o registrar al cliente en el DBMS.');
            }

            // 2. Preparar arreglos de productos y cantidades para el procedimiento de venta
            const p_productos = carrito.map((item: any) => Number(item.id_producto));
            const p_cantidades = carrito.map((item: any) => Number(item.cantidad));

            // 3. Invocar al stored procedure transaccional sp_registrar_venta
            const [spVentaResult]: any = await sequelize.query(
                'CALL sp_registrar_venta(?, ?, ?, ?, ?, ?)',
                {
                    replacements: [id_cliente, id_empleado, p_productos, p_cantidades, null, null],
                    transaction: t
                }
            );

            const result_id_venta = spVentaResult?.p_id_venta;
            const error_message = spVentaResult?.p_error_message;

            // Si el procedimiento reporta un error interno (ej: falta de stock), lanzamos excepción para disparar el ROLLBACK
            if (error_message && error_message.trim() !== '') {
                throw new Error(error_message);
            }

            if (!result_id_venta) {
                throw new Error('Error desconocido al procesar la venta a nivel de DBMS.');
            }

            return result_id_venta;
        });

        res.status(201).json({ mensaje: 'Venta procesada con éxito a nivel de DBMS', id_venta });

    } catch (error: any) {
        console.error('Error en transacción de venta:', error);
        
        const isPermissionError = error.parent?.code === '42501';
        res.status(isPermissionError ? 403 : 400).json({
            mensaje: isPermissionError
                ? 'Acceso denegado: Permisos de venta insuficientes en la base de datos (DBMS)'
                : error.message || 'Error al procesar la venta'
        });
    }
};

// ==========================================
// READ: Obtener historial de ventas para reportes (Enforzado por Rol)
// ==========================================
export const obtenerVentas = async (req: Request, res: Response): Promise<any> => {
    const idRol = req.user?.id_rol;
    try {
        const query = `
            SELECT v.id_venta, v.fecha_venta, v.total_venta, 
                   c.nombre_cliente, e.nombre_empleado 
            FROM venta v
            JOIN cliente c ON v.id_cliente = c.id_cliente
            JOIN empleado e ON v.id_empleado = e.id_empleado
            ORDER BY v.fecha_venta DESC
        `;
        const result = await executeInRoleTransaction(idRol, async (t) => {
            const [rows] = await sequelize.query(query, { transaction: t });
            return rows;
        });
        res.json(result);
    } catch (error: any) {
        console.error('Error al obtener ventas:', error);
        const isPermissionError = error.parent?.code === '42501';
        res.status(isPermissionError ? 403 : 500).json({
            mensaje: isPermissionError
                ? 'Acceso denegado: Permisos insuficientes a nivel de base de datos (DBMS)'
                : 'Error al obtener el historial de ventas'
        });
    }
};