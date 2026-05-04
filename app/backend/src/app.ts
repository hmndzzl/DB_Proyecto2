import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db';

import authRoutes from './routes/auth.routes';
import productosRoutes from './routes/productos.routes';
import ventasRoutes from './routes/ventas.routes';
import reportesRoutes from './routes/reportes.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json());

// ==========================================
// RUTAS DE LA APLICACIÓN
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/reportes', reportesRoutes);

// Ruta de salud para verificar que el contenedor del backend está vivo
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', message: 'API funcionando correctamente' });
});

// ==========================================
// INICIALIZACIÓN DEL SERVIDOR
// ==========================================
app.listen(PORT, async () => {
    console.log(`Backend corriendo en http://localhost:${PORT}`);

    // Verificacion con la base de datos
    try {
        const dbRes = await pool.query('SELECT NOW()');
        console.log('Conexión verificada con PostgreSQL. Hora del servidor DB:', dbRes.rows[0].now);
    } catch (error) {
        console.error('Error crítico al intentar conectar con PostgreSQL:', error);
    }
});

export default app;