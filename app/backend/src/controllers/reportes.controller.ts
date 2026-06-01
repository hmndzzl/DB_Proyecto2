import { Request, Response } from 'express';
import sequelize from '../config/sequelize';
import { executeInRoleTransaction } from '../config/roleExecutor';

// ==========================================
// REPORTE 1: Usa el VIEW y funciones de agregación
// ==========================================
export const reporteGeneralVentas = async (req: Request, res: Response): Promise<any> => {
    const idRol = req.user?.id_rol;
    try {
        const query = `
            SELECT 
              nombre_categoria,
              COUNT(id_venta) as total_operaciones,
              SUM(subtotal) as ingresos_totales
            FROM vista_ventas_detalladas
            GROUP BY nombre_categoria
            ORDER BY ingresos_totales DESC;
        `;
        const result = await executeInRoleTransaction(idRol, async (t) => {
            const [rows] = await sequelize.query(query, { transaction: t });
            return rows;
        });
        res.json(result);
    } catch (error: any) {
        console.error('Error en reporteGeneralVentas:', error);
        const isPermissionError = error.parent?.code === '42501';
        res.status(isPermissionError ? 403 : 500).json({
            mensaje: isPermissionError
                ? 'Acceso denegado: Permisos insuficientes a nivel de base de datos (DBMS)'
                : 'Error al generar reporte de ventas'
        });
    }
};

// ==========================================
// REPORTE 2: Consulta con CTE (WITH)
// ==========================================
export const reporteTopEmpleadosCTE = async (req: Request, res: Response): Promise<any> => {
    const idRol = req.user?.id_rol;
    try {
        const query = `
            WITH VentasPorEmpleado AS (
                SELECT 
                    id_empleado, 
                    COUNT(id_venta) as cantidad_ventas,
                    SUM(total_venta) as total_recaudado
                FROM venta
                GROUP BY id_empleado
            )
            SELECT 
                e.nombre_empleado,
                vpe.cantidad_ventas,
                vpe.total_recaudado
            FROM VentasPorEmpleado vpe
            JOIN empleado e ON vpe.id_empleado = e.id_empleado
            WHERE vpe.total_recaudado > 0
            ORDER BY vpe.total_recaudado DESC;
        `;
        const result = await executeInRoleTransaction(idRol, async (t) => {
            const [rows] = await sequelize.query(query, { transaction: t });
            return rows;
        });
        res.json(result);
    } catch (error: any) {
        console.error('Error en reporteTopEmpleadosCTE:', error);
        const isPermissionError = error.parent?.code === '42501';
        res.status(isPermissionError ? 403 : 500).json({
            mensaje: isPermissionError
                ? 'Acceso denegado: Permisos insuficientes a nivel de base de datos (DBMS)'
                : 'Error al generar reporte CTE'
        });
    }
};

// ==========================================
// REPORTE 3: Consulta con Subquery y HAVING
// ==========================================
export const reporteClientesVipSubquery = async (req: Request, res: Response): Promise<any> => {
    const idRol = req.user?.id_rol;
    try {
        const query = `
            SELECT 
                c.nombre_cliente,
                c.correo_cliente,
                SUM(v.total_venta) as total_gastado
            FROM cliente c
            JOIN venta v ON c.id_cliente = v.id_cliente
            WHERE c.id_cliente IN (
                -- SUBQUERY: Clientes que han comprado productos de la categoría 1 (ej. Electrónica)
                SELECT DISTINCT v2.id_cliente 
                FROM venta v2
                JOIN detalle_venta dv ON v2.id_venta = dv.id_venta
                JOIN producto p ON dv.id_producto = p.id_producto
                WHERE p.id_categoria = 6 -- ID 6 es Electrónica en 02_seeds.sql
            )
            GROUP BY c.id_cliente, c.nombre_cliente, c.correo_cliente
            HAVING SUM(v.total_venta) > 1000 -- HAVING obligatorio por rúbrica
            ORDER BY total_gastado DESC;
        `;
        const result = await executeInRoleTransaction(idRol, async (t) => {
            const [rows] = await sequelize.query(query, { transaction: t });
            return rows;
        });
        res.json(result);
    } catch (error: any) {
        console.error('Error en reporteClientesVipSubquery:', error);
        const isPermissionError = error.parent?.code === '42501';
        res.status(isPermissionError ? 403 : 500).json({
            mensaje: isPermissionError
                ? 'Acceso denegado: Permisos insuficientes a nivel de base de datos (DBMS)'
                : 'Error al generar reporte de clientes VIP'
        });
    }
};

// ==========================================
// REPORTE 4: Consulta con Subquery correlacionado (NOT EXISTS)
// ==========================================
export const reporteProductosSinVentas = async (req: Request, res: Response): Promise<any> => {
    const idRol = req.user?.id_rol;
    try {
        const query = `
            SELECT 
                p.nombre_producto,
                c.nombre_categoria,
                p.stock_producto
            FROM producto p
            JOIN categoria c ON p.id_categoria = c.id_categoria
            WHERE NOT EXISTS (
                -- SUBQUERY CORRELACIONADO: Verifica si hay detalles de venta para este producto
                SELECT 1 
                FROM detalle_venta dv 
                WHERE dv.id_producto = p.id_producto
            )
            ORDER BY p.stock_producto DESC;
        `;
        const result = await executeInRoleTransaction(idRol, async (t) => {
            const [rows] = await sequelize.query(query, { transaction: t });
            return rows;
        });
        res.json(result);
    } catch (error: any) {
        console.error('Error en reporteProductosSinVentas:', error);
        const isPermissionError = error.parent?.code === '42501';
        res.status(isPermissionError ? 403 : 500).json({
            mensaje: isPermissionError
                ? 'Acceso denegado: Permisos insuficientes a nivel de base de datos (DBMS)'
                : 'Error al generar reporte de productos sin ventas'
        });
    }
};

// ==========================================
// EXPORTAR: Generar archivo CSV de ventas
// ==========================================
export const exportarVentasCSV = async (req: Request, res: Response): Promise<any> => {
    const idRol = req.user?.id_rol;
    try {
        const query = 'SELECT * FROM vista_ventas_detalladas ORDER BY fecha_venta DESC';
        const datos: any[] = await executeInRoleTransaction(idRol, async (t) => {
            const [rows] = await sequelize.query(query, { transaction: t });
            return rows;
        });

        if (datos.length === 0) {
            return res.status(404).json({ mensaje: 'No hay datos para exportar' });
        }

        // Definir los encabezados del CSV
        const encabezados = [
            'ID Venta', 'Fecha', 'Cliente', 'Empleado',
            'Producto', 'Categoría', 'Cantidad', 'Precio Unitario', 'Subtotal'
        ];

        // Convertir los datos a filas de texto
        const filas = datos.map(v => [
            v.id_venta,
            new Date(v.fecha_venta).toLocaleString(),
            v.nombre_cliente,
            v.nombre_empleado,
            v.nombre_producto,
            v.nombre_categoria,
            v.cantidad,
            v.precio_unitario,
            v.subtotal
        ].join(','));

        // Unir todo con saltos de línea
        const csvContent = [encabezados.join(','), ...filas].join('\n');

        // Configurar los headers para que el navegador entienda que es una descarga
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=reporte_ventas.csv');

        // Enviar el contenido
        res.status(200).send(csvContent);

    } catch (error: any) {
        console.error('Error al exportar CSV:', error);
        const isPermissionError = error.parent?.code === '42501';
        res.status(isPermissionError ? 403 : 500).json({
            mensaje: isPermissionError
                ? 'Acceso denegado: Permisos insuficientes a nivel de base de datos (DBMS)'
                : 'Error al generar el archivo CSV'
        });
    }
};