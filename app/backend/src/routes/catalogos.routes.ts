import { Router } from 'express';
import { obtenerCategorias, obtenerProveedores, crearCategoria, actualizarCategoria, eliminarCategoria } from '../controllers/catalogos.controller';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware';
import { Roles } from '../config/rol';

const router = Router();

router.use(authMiddleware);

router.get('/categorias', obtenerCategorias);
router.post('/categorias', requireRole([Roles.ADMINISTRADOR, Roles.SUPERVISOR, Roles.INVENTARIO]), crearCategoria);
router.put('/categorias/:id', requireRole([Roles.ADMINISTRADOR, Roles.SUPERVISOR, Roles.INVENTARIO]), actualizarCategoria);
router.delete('/categorias/:id', requireRole([Roles.ADMINISTRADOR, Roles.SUPERVISOR, Roles.INVENTARIO]), eliminarCategoria);

router.get('/proveedores', obtenerProveedores);

export default router;