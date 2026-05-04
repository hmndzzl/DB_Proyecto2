import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Roles } from '../config/rol';

// Estructura del token JWT
export interface JwtPayload {
    id_empleado: number;
    id_rol: number;
}

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

/**
 * Middleware para verificar si la petición incluye un Token válido.
 * Extrae el "id_empleado" y el "id_rol" y los inyecta en req.user
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    // Verificar que exista el header y que tenga el formato "Bearer <token>"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ mensaje: 'Acceso denegado: Token no proporcionado o formato incorrecto' });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const secret = process.env.JWT_SECRET as string;
        // jwt.verify lanza un error si el token es inventado, fue modificado o ya expiró
        const decoded = jwt.verify(token, secret) as JwtPayload;

        // Si es válido, se guardan los datos del empleado en la request para usarlos en el controlador
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ mensaje: 'Token inválido o expirado. Por favor, inicie sesión nuevamente.' });
    }
}

/**
 * Middleware para verificar que el empleado tenga permisos para la ruta.
 * Incluye una jerarquía simple: El ADMINISTRADOR siempre tiene acceso.
 */
export function requireRole(allowedRoles: number[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const userRolId = req.user?.id_rol;

        if (userRolId === undefined) {
            res.status(403).json({ mensaje: 'Acceso denegado: Permisos insuficientes' });
            return;
        }

        // Jerarquía de seguridad:
        // Si el usuario es Administrador (1), se le da acceso automático a todo.
        // Si no es Administrador, se verifica si su rol está dentro del arreglo allowedRoles.
        const hasAccess = userRolId === Roles.ADMINISTRADOR || allowedRoles.includes(userRolId);

        if (!hasAccess) {
            res.status(403).json({ mensaje: 'Acceso denegado: Requiere mayores privilegios para esta acción' });
            return;
        }

        next();
    };
}