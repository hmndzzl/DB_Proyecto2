import { Router } from 'express';
import { obtenerCategorias, obtenerProveedores, crearCategoria, actualizarCategoria, eliminarCategoria } from '../controllers/catalogos.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/categorias', obtenerCategorias);
router.post('/categorias', crearCategoria);
router.put('/categorias/:id', actualizarCategoria);
router.delete('/categorias/:id', eliminarCategoria);

router.get('/proveedores', obtenerProveedores);

export default router;