import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

export const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Datos del usuario logueado
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : { nombre: 'Usuario', rol: 2 };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <aside className="sidebar">
            {/* 1. Área de la Marca y perfil de usuario */}
            <div className="sidebar-brand">
                <h2>Tienda Nova</h2>

                <div className="user-profile">
                    <p className="user-name">{user.nombre}</p>
                    <p className="user-role">{user.rol === 1 ? 'Administrador' : 'Vendedor'}</p>
                </div>
            </div>

            {/* 2. Menú de Navegación */}
            <nav className="sidebar-nav">
                {/* Solo muestra el Dashboard si es el Administrador */}
                {user.rol === 1 && (
                    <Link to="/dashboard" className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                        Dashboard
                    </Link>
                )}
                <Link to="/productos" className={`nav-item ${location.pathname === '/productos' ? 'active' : ''}`}>
                    Productos
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