import { Router } from 'express';
import { crearVenta, obtenerVentas } from '../controllers/ventas.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Todas las operaciones de ventas requieren estar autenticado (JWT)
router.use(authMiddleware);

// Rutas accesibles por cualquier empleado con sesión iniciada
router.post('/', crearVenta);
router.get('/', obtenerVentas);

export default router;