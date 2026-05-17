import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = () => {
    const { token } = useAuth();

    // Si no hay token, lo expulsa de vuelta a la pantalla de login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Si hay token, lo deja pasar a la ruta que solicitó
    return <Outlet />;
};