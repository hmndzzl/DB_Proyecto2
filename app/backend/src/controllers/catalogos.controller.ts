import { Request, Response } from 'express';
import sequelize from '../config/sequelize';
import { executeInRoleTransaction } from '../config/roleExecutor';
import { Categoria } from '../models/Categoria';
import { Proveedor } from '../models/Proveedor';

// ==========================================
// 1. Obtener todas las categorías (ORM)
// ==========================================
export const obtenerCategorias = async (req: Request, res: Response): Promise<any> => {
    const idRol = req.user?.id_rol;
    try {
        const categorias = await executeInRoleTransaction(idRol, async (t) => {
            return await Categoria.findAll({
                order: [['nombre_categoria', 'ASC']],
                transaction: t
            });
        });
        res.json(categorias);
    } catch (error: any) {
        console.error('Error al obtener categorías:', error);
        const isPermissionError = error.parent?.code === '42501';
        res.status(isPermissionError ? 403 : 500).json({
            mensaje: isPermissionError
                ? 'Acceso denegado: Permisos insuficientes a nivel de base de datos (DBMS)'
                : 'Error interno del servidor al obtener categorías'
        });
    }
};

// ==========================================
// 2. Obtener todos los proveedores (ORM)
// ==========================================
export const obtenerProveedores = async (req: Request, res: Response): Promise<any> => {
    const idRol = req.user?.id_rol;
    try {
        const proveedores = await executeInRoleTransaction(idRol, async (t) => {
            return await Proveedor.findAll({
                order: [['nombre_proveedor', 'ASC']],
                transaction: t
            });
        });
        res.json(proveedores);
    } catch (error: any) {
        console.error('Error al obtener proveedores:', error);
        const isPermissionError = error.parent?.code === '42501';
        res.status(isPermissionError ? 403 : 500).json({
            mensaje: isPermissionError
                ? 'Acceso denegado: Permisos insuficientes a nivel de base de datos (DBMS)'
                : 'Error interno del servidor al obtener proveedores'
        });
    }
};

// ==========================================
// 3. Crear una nueva categoría (ORM)
// ==========================================
export const crearCategoria = async (req: Request, res: Response): Promise<any> => {
    const { nombre_categoria, descripcion_categoria } = req.body;
    const idRol = req.user?.id_rol;
    try {
        const nuevaCategoria = await executeInRoleTransaction(idRol, async (t) => {
            return await Categoria.create(
                { nombre_categoria, descripcion_categoria },
                { transaction: t }
            );
        });
        res.status(201).json({ mensaje: 'Categoría creada', categoria: nuevaCategoria });
    } catch (error: any) {
        console.error('Error al crear categoría:', error);
        const isPermissionError = error.parent?.code === '42501';
        res.status(isPermissionError ? 403 : 500).json({
            mensaje: isPermissionError
                ? 'Acceso denegado: Permisos de escritura insuficientes en la base de datos (DBMS)'
                : 'Error al crear la categoría'
        });
    }
};

// ==========================================
// 4. Actualizar una categoría (ORM)
// ==========================================
export const actualizarCategoria = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const { nombre_categoria, descripcion_categoria } = req.body;
    const idRol = req.user?.id_rol;
    try {
        const categoriaActualizada = await executeInRoleTransaction(idRol, async (t) => {
            const [rowsAffected] = await Categoria.update(
                { nombre_categoria, descripcion_categoria },
                { where: { id_categoria: id }, transaction: t }
            );
            if (rowsAffected === 0) return null;
            return await Categoria.findByPk(Number(id), { transaction: t });
        });

        if (!categoriaActualizada) {
            return res.status(404).json({ mensaje: 'Categoría no encontrada' });
        }
        res.json({ mensaje: 'Categoría actualizada', categoria: categoriaActualizada });
    } catch (error: any) {
        console.error('Error al actualizar categoría:', error);
        const isPermissionError = error.parent?.code === '42501';
        res.status(isPermissionError ? 403 : 500).json({
            mensaje: isPermissionError
                ? 'Acceso denegado: Permisos de modificación insuficientes en la base de datos (DBMS)'
                : 'Error al actualizar la categoría'
        });
    }
};

// ==========================================
// 5. Eliminar una categoría de forma segura (Stored Procedure)
// ==========================================
export const eliminarCategoria = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const idRol = req.user?.id_rol;
    try {
        const result = await executeInRoleTransaction(idRol, async (t) => {
            // Invocar el stored procedure sp_eliminar_categoria_segura
            const [spResult]: any = await sequelize.query(
                'CALL sp_eliminar_categoria_segura(?, ?, ?)',
                {
                    replacements: [id, null, null],
                    transaction: t
                }
            );
            return {
                exito: spResult?.p_exito,
                mensaje: spResult?.p_mensaje
            };
        });

        if (!result.exito) {
            return res.status(400).json({ mensaje: result.mensaje });
        }

        res.json({ mensaje: result.mensaje });
    } catch (error: any) {
        console.error('Error al eliminar categoría:', error);
        const isPermissionError = error.parent?.code === '42501';
        res.status(isPermissionError ? 403 : 500).json({
            mensaje: isPermissionError
                ? 'Acceso denegado: Permisos de eliminación insuficientes en la base de datos (DBMS)'
                : 'Error al procesar la eliminación de la categoría'
        });
    }
};