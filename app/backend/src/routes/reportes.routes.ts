import { Router } from 'express';
import {
    reporteGeneralVentas,
    reporteTopEmpleadosCTE,
    reporteClientesVipSubquery,
    exportarVentasCSV
} from '../controllers/reportes.controller';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware';
import { Roles } from '../config/rol';

const router = Router();

// Requerir autenticación para ver reportes
router.use(authMiddleware);

// Endpoint 1: /api/reportes/ventas (Usa VIEW)
router.get('/ventas', reporteGeneralVentas);

// Endpoint 2: /api/reportes/empleados (Usa CTE)
router.get('/empleados', requireRole([Roles.ADMINISTRADOR]), reporteTopEmpleadosCTE);

// Endpoint 3: /api/reportes/clientes-vip (Usa Subquery + HAVING)
router.get('/clientes-vip', requireRole([Roles.ADMINISTRADOR]), reporteClientesVipSubquery);

// Endpoint 4: /api/reportes/exportar/csv
router.get('/exportar/csv', authMiddleware, requireRole([Roles.ADMINISTRADOR]), exportarVentasCSV);

export default router;