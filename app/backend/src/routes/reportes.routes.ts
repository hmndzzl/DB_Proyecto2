import { Router } from 'express';
import {
    reporteGeneralVentas,
    reporteTopEmpleadosCTE,
    reporteClientesVipSubquery,
    reporteProductosSinVentas,
    exportarVentasCSV
} from '../controllers/reportes.controller';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware';
import { Roles } from '../config/rol';

const router = Router();

// Requerir autenticación para ver reportes
router.use(authMiddleware);

// Endpoint 1: /api/reportes/ventas (Usa VIEW)
router.get('/ventas', requireRole([Roles.ADMINISTRADOR, Roles.SUPERVISOR, Roles.AUDITOR]), reporteGeneralVentas);

// Endpoint 2: /api/reportes/empleados (Usa CTE)
router.get('/empleados', requireRole([Roles.ADMINISTRADOR, Roles.SUPERVISOR, Roles.AUDITOR]), reporteTopEmpleadosCTE);

// Endpoint 3: /api/reportes/clientes-vip (Usa Subquery + HAVING)
router.get('/clientes-vip', requireRole([Roles.ADMINISTRADOR, Roles.SUPERVISOR, Roles.AUDITOR]), reporteClientesVipSubquery);

// Endpoint 4: /api/reportes/productos-sin-ventas (Usa Subquery NOT EXISTS)
router.get('/productos-sin-ventas', requireRole([Roles.ADMINISTRADOR, Roles.SUPERVISOR, Roles.AUDITOR]), reporteProductosSinVentas);

// Endpoint 5: /api/reportes/exportar/csv
router.get('/exportar/csv', requireRole([Roles.ADMINISTRADOR, Roles.SUPERVISOR, Roles.AUDITOR]), exportarVentasCSV);

export default router;