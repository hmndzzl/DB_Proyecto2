import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

export const Sidebar = () => {
    const location = useLocation();

    const { user, logout } = useAuth();
    
    // Fallback if user is somehow null
    const safeUser = user || { nombre: 'Usuario', rol: 2 };

    const handleLogout = () => {
        logout();
    };

    return (
        <aside className="sidebar">
            {/* 1. Área de la Marca y perfil de usuario */}
            <div className="sidebar-brand">
                <h2>Tienda Nova</h2>

                <div className="user-profile">
                    <p className="user-name">{String(safeUser.nombre || 'Usuario')}</p>
                    <p className="user-role">{safeUser.rol === 1 ? 'Administrador' : 'Vendedor'}</p>
                </div>
            </div>

            {/* 2. Menú de Navegación */}
            <nav className="sidebar-nav">
                {/* Solo muestra el Dashboard si es el Administrador */}
                {safeUser.rol === 1 && (
                    <Link to="/dashboard" className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                        Dashboard
                    </Link>
                )}
                <Link to="/productos" className={`nav-item ${location.pathname === '/productos' ? 'active' : ''}`}>
                    Productos
                </Link>
                <Link to="/categorias" className={`nav-item ${location.pathname === '/categorias' ? 'active' : ''}`}>
                    Categorías
                </Link>
                <Link to="/ventas" className={`nav-item ${location.pathname === '/ventas' ? 'active' : ''}`}>
                    Ventas
                </Link>
            </nav>

            {/* 3. Footer con el botón de Cerrar Sesión empujado hacia abajo */}
            <div className="sidebar-footer">
                <button onClick={handleLogout} className="btn-logout">
                    Cerrar Sesión
                </button>
            </div>
        </aside>
    );
};