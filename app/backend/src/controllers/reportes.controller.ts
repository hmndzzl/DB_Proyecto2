import { Request, Response } from 'express';
import pool from '../config/db';

// ==========================================
// REPORTE 1: Usa el VIEW y funciones de agregación
// ==========================================
export const reporteGeneralVentas = async (_req: Request, res: Response) => {
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
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al generar reporte de ventas' });
    }
};

// ==========================================
// REPORTE 2: Consulta con CTE (WITH)
// ==========================================
export const reporteTopEmpleadosCTE = async (_req: Request, res: Response) => {
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
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al generar reporte CTE' });
    }
};

// ==========================================
// REPORTE 3: Consulta con Subquery y HAVING
// ==========================================
export const reporteClientesVipSubquery = async (_req: Request, res: Response) => {
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
          WHERE p.id_categoria = 1
      )
      GROUP BY c.id_cliente, c.nombre_cliente, c.correo_cliente
      HAVING SUM(v.total_venta) > 1000 -- HAVING obligatorio por rúbrica
      ORDER BY total_gastado DESC;
    `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al generar reporte de clientes VIP' });
    }
};

// ==========================================
// EXPORTAR: Generar archivo CSV de ventas
// ==========================================
export const exportarVentasCSV = async (_req: Request, res: Response) => {
    try {
        // 1. Consultar los datos detallados de la Vista
        const query = 'SELECT * FROM vista_ventas_detalladas ORDER BY fecha_venta DESC';
        const result = await pool.query(query);
        const datos = result.rows;

        if (datos.length === 0) {
            return res.status(404).json({ mensaje: 'No hay datos para exportar' });
        }

        // 2. Definir los encabezados del CSV
        const encabezados = [
            'ID Venta', 'Fecha', 'Cliente', 'Empleado',
            'Producto', 'Categoría', 'Cantidad', 'Precio Unitario', 'Subtotal'
        ];

        // 3. Convertir los datos a filas de texto
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

        // 4. Configurar los headers para que el navegador entienda que es una descarga
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=reporte_ventas.csv');

        // Enviar el contenido
        res.status(200).send(csvContent);

    } catch (error) {
        console.error('Error al exportar CSV:', error);
        res.status(500).json({ mensaje: 'Error al generar el archivo CSV' });
    }
};