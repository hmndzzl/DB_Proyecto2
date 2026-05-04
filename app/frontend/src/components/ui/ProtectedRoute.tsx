import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
    // Verificar si existe el token en el almacenamiento local
    const token = localStorage.getItem('token');

    // Si no hay token, lo expulsa de vuelta a la pantalla de login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Si hay token, lo deja pasar a la ruta que solicitó
    return <Outlet />;
};