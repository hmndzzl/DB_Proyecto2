import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import './DashboardPage.css';

interface CategoriaReporte {
    nombre_categoria: string;
    total_operaciones: string;
    ingresos_totales: string;
}

interface ProductoSinVenta {
    nombre_producto: string;
    nombre_categoria: string;
    stock_producto: number;
}

export const DashboardPage = () => {
    const [reporteVentas, setReporteVentas] = useState<CategoriaReporte[]>([]);
    const [productosSinVentas, setProductosSinVentas] = useState<ProductoSinVenta[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Recuperar usuario
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const token = localStorage.getItem('token');

    // Si es un vendedor lo dirige inmediatamente a /productos
    if (user?.rol !== 1) {
        return <Navigate to="/productos" replace />;
    }

    useEffect(() => {
        const fetchReportes = async () => {
            try {
                const [resVentas, resSinVentas] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_URL}/api/reportes/ventas`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch(`${import.meta.env.VITE_API_URL}/api/reportes/productos-sin-ventas`, { headers: { 'Authorization': `Bearer ${token}` } })
                ]);
                
                if (resVentas.ok) setReporteVentas(await resVentas.json());
                if (resSinVentas.ok) setProductosSinVentas(await resSinVentas.json());
            } catch (error) {
                console.error('Error cargando reportes:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchReportes();
    }, [token]);

    // Función para descargar el CSV
    const handleDownloadCSV = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reportes/exportar/csv`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Error al descargar');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'reporte_ventas.csv';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            alert('Hubo un problema al exportar el reporte');
        }
    };

    // Cálculos totales para las tarjetas
    const ingresosTotales = reporteVentas.reduce((acc, curr) => acc + Number(curr.ingresos_totales), 0);
    const totalOperaciones = reporteVentas.reduce((acc, curr) => acc + Number(curr.total_operaciones), 0);

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div>
                    <h1>Panel de Control</h1>
                    <p>Resumen general de ventas y reportes</p>
                </div>
                <button onClick={handleDownloadCSV} className="btn-export">
                    ⬇️ Exportar CSV
                </button>
            </header>

            {isLoading ? (
                <p>Cargando reportes...</p>
            ) : (
                <>
                    {/* Tarjetas de Resumen */}
                    <div className="summary-cards">
                        <div className="card">
                            <h3>Ingresos Totales</h3>
                            <p className="card-value">Q. {ingresosTotales.toFixed(2)}</p>
                        </div>
                        <div className="card">
                            <h3>Total Operaciones</h3>
                            <p className="card-value">{totalOperaciones}</p>
                        </div>
                        <div className="card">
                            <h3>Categorías Activas</h3>
                            <p className="card-value">{reporteVentas.length}</p>
                        </div>
                    </div>

                    {/* Tabla de Reporte */}
                    <div className="report-section">
                        <h2>Ventas por Categoría</h2>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Categoría</th>
                                    <th>Cant. de Ventas</th>
                                    <th>Ingresos Generados</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reporteVentas.length === 0 ? (
                                    <tr><td colSpan={3} style={{ textAlign: 'center' }}>No hay ventas registradas aún</td></tr>
                                ) : (
                                    reporteVentas.map((row, index) => (
                                        <tr key={index}>
                                            <td>{row.nombre_categoria}</td>
                                            <td>{row.total_operaciones}</td>
                                            <td>Q. {Number(row.ingresos_totales).toFixed(2)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Tabla de Productos sin Ventas (Subquery) */}
                    <div className="report-section" style={{ marginTop: '2rem' }}>
                        <h2>Productos sin Historial de Ventas</h2>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Categoría</th>
                                    <th>Stock Actual</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productosSinVentas.length === 0 ? (
                                    <tr><td colSpan={3} style={{ textAlign: 'center' }}>Todos los productos tienen al menos una venta</td></tr>
                                ) : (
                                    productosSinVentas.map((row, index) => (
                                        <tr key={index}>
                                            <td>{row.nombre_producto}</td>
                                            <td>{row.nombre_categoria}</td>
                                            <td><span className="stock-badge normal">{row.stock_producto} uds.</span></td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};