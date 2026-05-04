import { Router } from 'express';
import { buscarClientePorNit } from '../controllers/clientes.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Protegemos la ruta con JWT
router.use(authMiddleware);

// GET /api/clientes/:nit
router.get('/:nit', buscarClientePorNit);

export default router;
