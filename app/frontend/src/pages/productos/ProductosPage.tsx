import { useState, useEffect } from 'react';
import './ProductosPage.css';

interface Producto {
    id_producto: number;
    nombre_producto: string;
    precio_producto: string;
    stock_producto: number;
    id_categoria: number;
    nombre_categoria?: string;
    id_proveedor: number;
    nombre_proveedor?: string;
}

interface Catalogo {
    id_categoria?: number;
    nombre_categoria?: string;
    id_proveedor?: number;
    nombre_proveedor?: string;
}

export const ProductosPage = () => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [categorias, setCategorias] = useState<Catalogo[]>([]);
    const [proveedores, setProveedores] = useState<Catalogo[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        nombre_producto: '',
        precio_producto: '',
        stock_producto: '',
        id_categoria: '',
        id_proveedor: ''
    });

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const esAdmin = user.rol === 1;

    const fetchData = async () => {
        try {
            const headers = { 'Authorization': `Bearer ${token}` };

            // Hacemos las 3 llamadas al backend al mismo tiempo para mayor velocidad
            const [resProd, resCat, resProv] = await Promise.all([
                fetch(`${import.meta.env.VITE_API_URL}/api/productos`, { headers }),
                fetch(`${import.meta.env.VITE_API_URL}/api/catalogos/categorias`, { headers }),
                fetch(`${import.meta.env.VITE_API_URL}/api/catalogos/proveedores`, { headers })
            ]);

            if (resProd.ok) setProductos(await resProd.json());
            if (resCat.ok) setCategorias(await resCat.json());
            if (resProv.ok) setProveedores(await resProv.json());

        } catch (error) {
            console.error('Error cargando datos:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleOpenModal = (prod?: Producto) => {
        if (prod) {
            setIsEditing(true);
            setCurrentId(prod.id_producto);

            setFormData({
                nombre_producto: prod.nombre_producto || '',
                precio_producto: prod.precio_producto || '',
                stock_producto: prod.stock_producto?.toString() || '',
                id_categoria: prod.id_categoria?.toString() || '',
                id_proveedor: prod.id_proveedor?.toString() || ''
            });
        } else {
            setIsEditing(false);
            setFormData({
                nombre_producto: '',
                precio_producto: '',
                stock_producto: '',
                id_categoria: '',
                id_proveedor: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = isEditing
            ? `${import.meta.env.VITE_API_URL}/api/productos/${currentId}`
            : `${import.meta.env.VITE_API_URL}/api/productos`;

        const method = isEditing ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setIsModalOpen(false);
                fetchData();
            } else {
                alert("Ocurrió un error al guardar el producto");
            }
        } catch (error) {
            alert("Error de conexión");
        }
    };

    const eliminarProducto = async (id: number, nombre: string) => {
        if (!window.confirm(`¿Estás seguro de eliminar "${nombre}"?`)) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/productos/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setProductos(productos.filter(p => p.id_producto !== id));
            } else {
                alert('No se puede eliminar el producto. Podría estar asociado a una venta.');
            }
        } catch (error) {
            console.error('Error al eliminar:', error);
        }
    };

    return (
        <div className="productos-container">
            <header className="productos-header">
                <div>
                    <h1>Inventario de Productos</h1>
                    <p>Gestión de stock</p>
                </div>
                {esAdmin && <button className="btn-agregar" onClick={() => handleOpenModal()}>+ Nuevo Producto</button>}
            </header>

            {isLoading ? (
                <p style={{ textAlign: 'center', marginTop: '2rem' }}>Cargando catálogo...</p>
            ) : (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Categoría</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                {esAdmin && <th>Acciones</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {productos.map(p => (
                                <tr key={p.id_producto}>
                                    <td className="fw-bold">{p.nombre_producto}</td>
                                    <td>{p.nombre_categoria}</td>
                                    <td className="precio">Q. {Number(p.precio_producto).toFixed(2)}</td>
                                    <td>
                                        <span className={`stock-badge ${p.stock_producto < 10 ? 'bajo' : 'normal'}`}>
                                            {p.stock_producto} uds.
                                        </span>
                                    </td>
                                    {esAdmin && (
                                        <td className="acciones-cell">
                                            <button className="btn-icon edit" onClick={() => handleOpenModal(p)}>✏️</button>
                                            <button className="btn-icon delete" onClick={() => eliminarProducto(p.id_producto, p.nombre_producto)}>🗑️</button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* MODAL PARA CREAR/EDITAR */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 style={{ fontFamily: 'var(--font-titulos)' }}>{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label>Nombre del Producto</label>
                                <input
                                    type="text"
                                    value={formData.nombre_producto}
                                    onChange={e => setFormData({ ...formData, nombre_producto: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--gris-arena)', boxSizing: 'border-box' }}
                                />
                            </div>
                            <div className="form-row" style={{ marginBottom: '1rem' }}>
                                <div className="form-group">
                                    <label>Precio (Q)</label>
                                    <input
                                        type="number" step="0.01"
                                        value={formData.precio_producto}
                                        onChange={e => setFormData({ ...formData, precio_producto: e.target.value })}
                                        required
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--gris-arena)', boxSizing: 'border-box' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Stock Inicial</label>
                                    <input
                                        type="number"
                                        value={formData.stock_producto}
                                        onChange={e => setFormData({ ...formData, stock_producto: e.target.value })}
                                        required
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--gris-arena)', boxSizing: 'border-box' }}
                                    />
                                </div>
                            </div>

                            {/* AQUÍ ESTÁN LOS MENÚS DESPLEGABLES CONECTADOS A TUS NUEVOS ENDPOINTS */}
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Categoría</label>
                                    <select
                                        value={formData.id_categoria}
                                        onChange={e => setFormData({ ...formData, id_categoria: e.target.value })}
                                        required
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--gris-arena)', boxSizing: 'border-box', backgroundColor: 'white' }}
                                    >
                                        <option value="">Seleccione una...</option>
                                        {categorias.map(cat => (
                                            <option key={cat.id_categoria} value={cat.id_categoria}>
                                                {cat.nombre_categoria}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Proveedor</label>
                                    <select
                                        value={formData.id_proveedor}
                                        onChange={e => setFormData({ ...formData, id_proveedor: e.target.value })}
                                        required
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--gris-arena)', boxSizing: 'border-box', backgroundColor: 'white' }}
                                    >
                                        <option value="">Seleccione uno...</option>
                                        {proveedores.map(prov => (
                                            <option key={prov.id_proveedor} value={prov.id_proveedor}>
                                                {prov.nombre_proveedor}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                                <button type="submit" className="btn-save">Guardar Cambios</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};