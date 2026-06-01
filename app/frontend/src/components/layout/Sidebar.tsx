import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

export const Sidebar = () => {
    const location = useLocation();
    const { user, logout } = useAuth();
    
    // Fallback si el usuario no ha cargado correctamente
    const safeUser = user || { nombre: 'Usuario', rol: 5 };

    const handleLogout = () => {
        logout();
    };

    // Helper para obtener la etiqueta de rol en texto
    const getRoleLabel = (rolId?: number): string => {
        switch (rolId) {
            case 1: return 'Administrador';
            case 2: return 'Vendedor';
            case 3: return 'Supervisor';
            case 4: return 'Inventario';
            case 5: return 'Auditor';
            default: return 'Empleado';
        }
    };

    // Reglas de visualización por rol
    const showDashboard = safeUser.rol === 1 || safeUser.rol === 3;
    const showProductos = safeUser.rol === 1 || safeUser.rol === 2 || safeUser.rol === 3 || safeUser.rol === 4 || safeUser.rol === 5;
    const showCategorias = safeUser.rol === 1 || safeUser.rol === 2 || safeUser.rol === 3 || safeUser.rol === 4 || safeUser.rol === 5;
    const showVentas = safeUser.rol === 1 || safeUser.rol === 2 || safeUser.rol === 3 || safeUser.rol === 5;

    return (
        <aside className="sidebar">
            {/* 1. Área de la Marca y perfil de usuario */}
            <div className="sidebar-brand">
                <h2>Tienda Nova</h2>

                <div className="user-profile">
                    <p className="user-name">{String(safeUser.nombre || 'Usuario')}</p>
                    <p className="user-role">{getRoleLabel(safeUser.rol)}</p>
                </div>
            </div>

            {/* 2. Menú de Navegación */}
            <nav className="sidebar-nav">
                {showDashboard && (
                    <Link to="/dashboard" className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                        Dashboard
                    </Link>
                )}
                {showProductos && (
                    <Link to="/productos" className={`nav-item ${location.pathname === '/productos' ? 'active' : ''}`}>
                        Productos
                    </Link>
                )}
                {showCategorias && (
                    <Link to="/categorias" className={`nav-item ${location.pathname === '/categorias' ? 'active' : ''}`}>
                        Categorías
                    </Link>
                )}
                {showVentas && (
                    <Link to="/ventas" className={`nav-item ${location.pathname === '/ventas' ? 'active' : ''}`}>
                        Ventas
                    </Link>
                )}
            </nav>

            {/* 3. Footer con el botón de Cerrar Sesión */}
            <div className="sidebar-footer">
                <button onClick={handleLogout} className="btn-logout">
                    Cerrar Sesión
                </button>
            </div>
        </aside>
    );
};