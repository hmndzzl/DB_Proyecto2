import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Pool de conexiones
const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    max: 20, // Número máximo de clientes en el pool
    idleTimeoutMillis: 30000, // Cerrar clientes inactivos después de 30 segundos
    connectionTimeoutMillis: 2000, // Retornar error si tarda más de 2s en conectar
});

pool.on('connect', () => {
    console.log('📦 Conexión a PostgreSQL establecida correctamente');
});

pool.on('error', (err) => {
    console.error('❌ Error inesperado en la base de datos:', err);
    process.exit(-1);
});

export default pool;