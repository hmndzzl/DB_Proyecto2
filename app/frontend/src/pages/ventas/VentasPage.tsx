import { useState, useEffect } from 'react';
import './VentasPage.css';

interface Producto {
    id_producto: number;
    nombre_producto: string;
    precio_producto: string;
    stock_producto: number;
}

interface Venta {
    id_venta: number;
    fecha_venta: string;
    total_venta: string;
    nombre_empleado: string;
    nombre_cliente?: string;
}

interface CartItem {
    id_producto: number;
    nombre_producto: string;
    precio_unitario: number;
    cantidad: number;
    subtotal: number;
}

export const VentasPage = () => {
    const [ventas, setVentas] = useState<Venta[]>([]);
    const [productos, setProductos] = useState<Producto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Estado del Carrito y Selección de Producto
    const [carrito, setCarrito] = useState<CartItem[]>([]);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [selectedCantidad, setSelectedCantidad] = useState(1);

    // Estado del Cliente
    const [cliente, setCliente] = useState({ nit: '', nombre: '', correo: '' });
    const [isClienteRegistrado, setIsClienteRegistrado] = useState(false);
    const [isSearchingCliente, setIsSearchingCliente] = useState(false);

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const fetchData = async () => {
        try {
            const headers = { 'Authorization': `Bearer ${token}` };

            // Cargamos el historial de ventas y el catálogo de productos disponibles
            const [resVentas, resProd] = await Promise.all([
                fetch(`${import.meta.env.VITE_API_URL}/api/ventas`, { headers }),
                fetch(`${import.meta.env.VITE_API_URL}/api/productos`, { headers })
            ]);

            if (resVentas.ok) setVentas(await resVentas.json());
            if (resProd.ok) setProductos(await resProd.json());

        } catch (error) {
            console.error('Error cargando datos:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // Buscar Cliente por NIT
    const handleBuscarCliente = async () => {
        if (!cliente.nit) return;
        setIsSearchingCliente(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/clientes/${cliente.nit}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setCliente({ nit: data.nit_cliente, nombre: data.nombre_cliente, correo: data.correo_cliente || '' });
                setIsClienteRegistrado(true);
            } else {
                // Cliente no encontrado, permitimos ingresarlo
                setCliente(prev => ({ ...prev, nombre: '', correo: '' }));
                setIsClienteRegistrado(false);
            }
        } catch (error) {
            console.error('Error al buscar cliente:', error);
        } finally {
            setIsSearchingCliente(false);
        }
    };

    // Agregar producto al carrito
    const handleAddToCart = () => {
        if (!selectedProductId || selectedCantidad <= 0) return;

        const productoDb = productos.find(p => p.id_producto.toString() === selectedProductId);
        if (!productoDb) return;

        // Verifica si ya está en el carrito para sumar la cantidad
        const itemExistente = carrito.find(item => item.id_producto === productoDb.id_producto);
        const cantidadTotal = (itemExistente?.cantidad || 0) + selectedCantidad;

        if (cantidadTotal > productoDb.stock_producto) {
            alert(`Stock insuficiente. Solo quedan ${productoDb.stock_producto} unidades en total.`);
            return;
        }

        if (itemExistente) {
            setCarrito(carrito.map(item =>
                item.id_producto === productoDb.id_producto
                    ? { ...item, cantidad: cantidadTotal, subtotal: cantidadTotal * item.precio_unitario }
                    : item
            ));
        } else {
            setCarrito([...carrito, {
                id_producto: productoDb.id_producto,
                nombre_producto: productoDb.nombre_producto,
                precio_unitario: Number(productoDb.precio_producto),
                cantidad: selectedCantidad,
                subtotal: Number(productoDb.precio_producto) * selectedCantidad
            }]);
        }

        // Reset inputs
        setSelectedProductId('');
        setSelectedCantidad(1);
    };

    // Remover producto del carrito
    const handleRemoveFromCart = (id_producto: number) => {
        setCarrito(carrito.filter(item => item.id_producto !== id_producto));
    };

    const totalEstimado = carrito.reduce((sum, item) => sum + item.subtotal, 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (carrito.length === 0) {
            alert("El carrito está vacío. Agrega al menos un producto.");
            return;
        }

        if (!cliente.nit || !cliente.nombre) {
            alert("Los datos del cliente (NIT y Nombre) son obligatorios.");
            return;
        }

        try {
            const payload = {
                cliente: {
                    nit: cliente.nit,
                    nombre: cliente.nombre,
                    correo: cliente.correo
                },
                carrito: carrito.map(item => ({
                    id_producto: item.id_producto,
                    cantidad: item.cantidad
                })),
                id_empleado: user.id || user.id_empleado
            };

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ventas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                // Reset states
                setIsModalOpen(false);
                setCarrito([]);
                setCliente({ nit: '', nombre: '', correo: '' });
                setIsClienteRegistrado(false);
                fetchData(); // Recargar historial y productos para actualizar stock
                alert("Venta registrada con éxito.");
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.mensaje}`);
            }
        } catch (error) {
            alert("Error de conexión al procesar la venta");
        }
    };

    return (
        <div className="ventas-container">
            <header className="ventas-header">
                <div>
                    <h1>Registro de Ventas</h1>
                    <p>Facturación, carrito y salidas de inventario</p>
                </div>
                <button className="btn-nueva-venta" onClick={() => setIsModalOpen(true)}>
                    + Nueva Venta
                </button>
            </header>

            {isLoading ? (
                <p style={{ textAlign: 'center', marginTop: '2rem' }}>Cargando historial...</p>
            ) : (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID Venta</th>
                                <th>Fecha</th>
                                <th>Cliente</th>
                                <th>Vendedor</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ventas.length === 0 ? (
                                <tr><td colSpan={5} style={{ textAlign: 'center' }}>No hay ventas registradas</td></tr>
                            ) : (
                                ventas.map(v => (
                                    <tr key={v.id_venta}>
                                        <td className="text-muted">#{v.id_venta}</td>
                                        <td>{new Date(v.fecha_venta).toLocaleDateString()}</td>
                                        <td>{v.nombre_cliente || 'Consumidor Final'}</td>
                                        <td>{v.nombre_empleado}</td>
                                        <td className="precio-total">Q. {Number(v.total_venta).toFixed(2)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* MODAL DE NUEVA VENTA */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content modal-venta-large">
                        <h2 style={{ fontFamily: 'var(--font-titulos)' }}>Procesar Venta</h2>

                        <div className="modal-body-split">
                            {/* COLUMNA IZQUIERDA: Cliente y Formulario de Producto */}
                            <div className="venta-col-left">
                                <section className="venta-section">
                                    <h3>1. Datos del Cliente</h3>
                                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                                        <label>NIT *</label>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <input
                                                type="text"
                                                value={cliente.nit}
                                                onChange={e => setCliente({ ...cliente, nit: e.target.value })}
                                                onBlur={handleBuscarCliente}
                                                onKeyDown={e => e.key === 'Enter' && handleBuscarCliente()}
                                                placeholder="Ej. 1234567-8"
                                                className="input-field"
                                            />
                                            <button type="button" className="btn-secondary" onClick={handleBuscarCliente} disabled={isSearchingCliente}>
                                                {isSearchingCliente ? '...' : 'Buscar'}
                                            </button>
                                        </div>
                                        {isClienteRegistrado && <small style={{ color: 'var(--verde)' }}>✓ Cliente encontrado</small>}
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Nombre *</label>
                                            <input
                                                type="text"
                                                value={cliente.nombre}
                                                onChange={e => setCliente({ ...cliente, nombre: e.target.value })}
                                                disabled={isClienteRegistrado}
                                                required
                                                className="input-field"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Correo (opcional)</label>
                                            <input
                                                type="email"
                                                value={cliente.correo}
                                                onChange={e => setCliente({ ...cliente, correo: e.target.value })}
                                                disabled={isClienteRegistrado}
                                                className="input-field"
                                            />
                                        </div>
                                    </div>
                                </section>

                                <section className="venta-section">
                                    <h3>2. Agregar Producto</h3>
                                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                                        <label>Producto</label>
                                        <select
                                            value={selectedProductId}
                                            onChange={e => setSelectedProductId(e.target.value)}
                                            className="input-field"
                                        >
                                            <option value="">Seleccione un producto...</option>
                                            {productos.filter(p => p.stock_producto > 0).map(p => (
                                                <option key={p.id_producto} value={p.id_producto}>
                                                    {p.nombre_producto} - Q.{Number(p.precio_producto).toFixed(2)} (Stock: {p.stock_producto})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-row align-end">
                                        <div className="form-group" style={{ flex: 1 }}>
                                            <label>Cantidad</label>
                                            <input
                                                type="number" min="1"
                                                value={selectedCantidad}
                                                onChange={e => setSelectedCantidad(Number(e.target.value))}
                                                className="input-field"
                                            />
                                        </div>
                                        <div className="form-group" style={{ flex: 1 }}>
                                            <button type="button" className="btn-add-cart" onClick={handleAddToCart} disabled={!selectedProductId}>
                                                + Añadir
                                            </button>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* COLUMNA DERECHA: Carrito de Compras */}
                            <div className="venta-col-right">
                                <section className="venta-section cart-section">
                                    <h3>3. Carrito de Compras</h3>
                                    <div className="cart-items-container">
                                        {carrito.length === 0 ? (
                                            <p className="cart-empty">El carrito está vacío</p>
                                        ) : (
                                            <ul className="cart-list">
                                                {carrito.map(item => (
                                                    <li key={item.id_producto} className="cart-item">
                                                        <div className="cart-item-info">
                                                            <span className="cart-item-name">{item.nombre_producto}</span>
                                                            <span className="cart-item-qty">{item.cantidad} x Q.{item.precio_unitario.toFixed(2)}</span>
                                                        </div>
                                                        <div className="cart-item-actions">
                                                            <span className="cart-item-sub">Q.{item.subtotal.toFixed(2)}</span>
                                                            <button type="button" className="btn-remove" onClick={() => handleRemoveFromCart(item.id_producto)}>✕</button>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    <div className="total-box">
                                        <span>Total a Cobrar:</span>
                                        <span className="total-amount">Q. {totalEstimado.toFixed(2)}</span>
                                    </div>
                                </section>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                            <button type="submit" className="btn-cobrar" onClick={handleSubmit} disabled={carrito.length === 0 || !cliente.nit || !cliente.nombre}>
                                Confirmar y Cobrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};