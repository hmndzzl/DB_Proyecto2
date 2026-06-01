import { Router } from 'express';
import { buscarClientePorNit, crearCliente } from '../controllers/clientes.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

// GET /api/clientes/:nit
router.get('/:nit', buscarClientePorNit);

// POST /api/clientes
router.post('/', crearCliente);

export default router;
