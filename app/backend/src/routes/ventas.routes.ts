import { Router } from 'express';
import { crearVenta, obtenerVentas } from '../controllers/ventas.controller';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware';
import { Roles } from '../config/rol';

const router = Router();

// Todas las operaciones de ventas requieren estar autenticado (JWT)
router.use(authMiddleware);

// Rutas accesibles según rol
router.post('/', requireRole([Roles.ADMINISTRADOR, Roles.VENDEDOR, Roles.SUPERVISOR]), crearVenta);
router.get('/', requireRole([Roles.ADMINISTRADOR, Roles.VENDEDOR, Roles.SUPERVISOR, Roles.AUDITOR]), obtenerVentas);

export default router;