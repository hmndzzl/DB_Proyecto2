import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize';

export class Cliente extends Model {
    public id_cliente!: number;
    public nombre_cliente!: string;
    public correo_cliente!: string | null;
    public nit_cliente!: string | null;
}

Cliente.init(
    {
        id_cliente: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nombre_cliente: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        correo_cliente: {
            type: DataTypes.STRING(100),
            allowNull: true,
            unique: true,
        },
        nit_cliente: {
            type: DataTypes.STRING(20),
            allowNull: true,
            unique: true,
        },
    },
    {
        sequelize,
        tableName: 'cliente',
    }
);
export default Cliente;
