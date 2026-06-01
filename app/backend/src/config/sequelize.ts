import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME as string,
    process.env.DB_USER as string,
    process.env.DB_PASSWORD as string,
    {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 5432,
        dialect: 'postgres',
        logging: false, // Desactivado para no llenar la consola, cambiar a console.log para debugging
        pool: {
            max: 20,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            timestamps: false, // Evita que busque columnas createdAt y updatedAt
            freezeTableName: true // Evita que pluralice el nombre de las tablas
        }
    }
);

export default sequelize;
