import { Router } from 'express';
import { obtenerCategorias, obtenerProveedores } from '../controllers/catalogos.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/categorias', obtenerCategorias);
router.get('/proveedores', obtenerProveedores);

export default router;