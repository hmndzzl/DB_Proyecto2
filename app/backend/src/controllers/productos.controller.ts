import { Request, Response } from 'express';
import sequelize from '../config/sequelize';
import { executeInRoleTransaction } from '../config/roleExecutor';
import { Producto } from '../models/Producto';
import { Categoria } from '../models/Categoria';
import { Proveedor } from '../models/Proveedor';

// ==========================================
// 1. READ: Obtener todos los productos (ORM)
// ==========================================
export const obtenerProductos = async (req: Request, res: Response): Promise<any> => {
    try {
        const idRol = req.user?.id_rol;
        const productos = await executeInRoleTransaction(idRol, async (t) => {
            return await Producto.findAll({
                include: [
                    { model: Categoria, as: 'categoria', attributes: ['nombre_categoria'] },
                    { model: Proveedor, as: 'proveedor', attributes: ['nombre_proveedor'] }
                ],
                order: [['id_producto', 'ASC']],
                transaction: t
            });
        });

        // Mapear el formato de respuesta esperado por la UI
        const formatted = productos.map((p: any) => ({
            id_producto: p.id_producto,
            nombre_producto: p.nombre_producto,
            precio_producto: p.precio_producto,
            stock_producto: p.stock_producto,
            id_categoria: p.id_categoria,
            nombre_categoria: p.categoria?.nombre_categoria || 'Sin Categoría',
            id_proveedor: p.id_proveedor,
            nombre_proveedor: p.proveedor?.nombre_proveedor || 'Sin Proveedor'
        }));

        res.json(formatted);
    } catch (error: any) {
        console.error('Error al obtener productos:', error);
        const isPermissionError = error.parent?.code === '42501';
        res.status(isPermissionError ? 403 : 500).json({
            mensaje: isPermissionError
                ? 'Acceso denegado: Permisos insuficientes a nivel de base de datos (DBMS)'
                : 'Error interno del servidor al obtener los productos'
        });
    }
};

// ==========================================
// 2. READ: Obtener un solo producto por ID (ORM)
// ==========================================
export const obtenerProductoPorId = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const idRol = req.user?.id_rol;
    try {
        const producto = await executeInRoleTransaction(idRol, async (t) => {
            return await Producto.findByPk(id, { transaction: t });
        });

        if (!producto) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (error: any) {
        console.error('Error al obtener producto por ID:', error);
        const isPermissionError = error.parent?.code === '42501';
        res.status(isPermissionError ? 403 : 500).json({
            mensaje: isPermissionError
                ? 'Acceso denegado: Permisos insuficientes a nivel de base de datos (DBMS)'
                : 'Error interno del servidor'
        });
    }
};

// ==========================================
// 3. CREATE: Crear un nuevo producto (Stored Procedure)
// ==========================================
export const crearProducto = async (req: Request, res: Response): Promise<any> => {
    const { nombre_producto, precio_producto, stock_producto, id_categoria, id_proveedor } = req.body;
    const idRol = req.user?.id_rol;

    try {
        const nuevoProducto = await executeInRoleTransaction(idRol, async (t) => {
            // Invocar el stored procedure sp_crear_producto
            const [spResult]: any = await sequelize.query(
                'CALL sp_crear_producto(?, ?, ?, ?, ?, ?)',
                {
                    replacements: [nombre_producto, precio_producto, stock_producto, id_categoria, id_proveedor, null],
                    transaction: t
                }
            );
            const id_producto = spResult?.p_id_producto;

            // Retornar el registro creado consultándolo por el ORM
            return await Producto.findByPk(id_producto, { transaction: t });
        });

        res.status(201).json({
            mensaje: 'Producto creado exitosamente',
            producto: nuevoProducto
        });
    } catch (error: any) {
        console.error('Error al crear producto:', error);
        const isPermissionError = error.parent?.code === '42501';
        res.status(isPermissionError ? 403 : 500).json({
            mensaje: isPermissionError
                ? 'Acceso denegado: Permisos de escritura insuficientes en la base de datos (DBMS)'
                : 'Error al crear el producto. Verifique los datos enviados.'
        });
    }
};

// ==========================================
// 4. UPDATE: Actualizar un producto (ORM)
// ==========================================
export const actualizarProducto = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const { nombre_producto, precio_producto, stock_producto, id_categoria, id_proveedor } = req.body;
    const idRol = req.user?.id_rol;

    try {
        const productoActualizado = await executeInRoleTransaction(idRol, async (t) => {
            const [rowsAffected] = await Producto.update(
                { nombre_producto, precio_producto, stock_producto, id_categoria, id_proveedor },
                { where: { id_producto: id }, transaction: t }
            );

            if (rowsAffected === 0) return null;
            return await Producto.findByPk(id, { transaction: t });
        });

        if (!productoActualizado) {
            return res.status(404).json({ mensaje: 'Producto no encontrado para actualizar' });
        }

        res.json({ mensaje: 'Producto actualizado exitosamente', producto: productoActualizado });
    } catch (error: any) {
        console.error('Error al actualizar producto:', error);
        const isPermissionError = error.parent?.code === '42501';
        res.status(isPermissionError ? 403 : 500).json({
            mensaje: isPermissionError
                ? 'Acceso denegado: Permisos de modificación insuficientes en la base de datos (DBMS)'
                : 'Error al actualizar el producto'
        });
    }
};

// ==========================================
// 5. DELETE: Eliminar un producto (ORM)
// ==========================================
export const eliminarProducto = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const idRol = req.user?.id_rol;

    try {
        const exito = await executeInRoleTransaction(idRol, async (t) => {
            const rowsAffected = await Producto.destroy({
                where: { id_producto: id },
                transaction: t
            });
            return rowsAffected > 0;
        });

        if (!exito) {
            return res.status(404).json({ mensaje: 'Producto no encontrado para eliminar' });
        }

        res.json({ mensaje: 'Producto eliminado correctamente' });
    } catch (error: any) {
        console.error('Error al eliminar producto:', error);
        const isPermissionError = error.parent?.code === '42501';
        res.status(isPermissionError ? 403 : 500).json({
            mensaje: isPermissionError
                ? 'Acceso denegado: Permisos de eliminación insuficientes en la base de datos (DBMS)'
                : 'Error al eliminar el producto. Podría estar asociado a una venta existente.'
        });
    }
};