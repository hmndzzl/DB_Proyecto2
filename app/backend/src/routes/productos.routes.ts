import { Router } from 'express';
import {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto
} from '../controllers/productos.controller';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware';
import { Roles } from '../config/rol';

const router = Router();

// Todas las rutas de productos requerirán al menos estar autenticado
router.use(authMiddleware);

// Rutas accesibles por CUALQUIER empleado logueado
router.get('/', obtenerProductos);
router.get('/:id', obtenerProductoPorId);

// Rutas RESTRINGIDAS: Solo el Administrador puede modificar el inventario
router.post('/', requireRole([Roles.ADMINISTRADOR]), crearProducto);
router.put('/:id', requireRole([Roles.ADMINISTRADOR]), actualizarProducto);
router.delete('/:id', requireRole([Roles.ADMINISTRADOR]), eliminarProducto);

export default router;