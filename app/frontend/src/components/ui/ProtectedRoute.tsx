import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
    allowedRoles?: number[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const { token, user } = useAuth();

    // Si no hay token, lo expulsa de vuelta a la pantalla de login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Si hay roles permitidos definidos, validar que el usuario cuente con los permisos
    if (allowedRoles && user && !allowedRoles.includes(Number(user.rol))) {
        // Redirección amigable basada en el rol
        if (Number(user.rol) === 4) {
            return <Navigate to="/productos" replace />; // El rol Inventario sólo ve Productos
        }
        // Vendedor y Auditor no tienen acceso a Dashboard, los mandamos a Productos o Ventas
        if (Number(user.rol) === 2 || Number(user.rol) === 5) {
            return <Navigate to="/productos" replace />;
        }
        return <Navigate to="/login" replace />;
    }

    // Si cumple con todo, se le permite el acceso
    return <Outlet />;
};