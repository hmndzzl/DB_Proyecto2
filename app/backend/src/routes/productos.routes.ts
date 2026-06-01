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

// Rutas RESTRINGIDAS: Administrador, Supervisor e Inventario pueden modificar el inventario
router.post('/', requireRole([Roles.ADMINISTRADOR, Roles.SUPERVISOR, Roles.INVENTARIO]), crearProducto);
router.put('/:id', requireRole([Roles.ADMINISTRADOR, Roles.SUPERVISOR, Roles.INVENTARIO]), actualizarProducto);
router.delete('/:id', requireRole([Roles.ADMINISTRADOR, Roles.SUPERVISOR, Roles.INVENTARIO]), eliminarProducto);

export default router;