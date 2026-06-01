import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize';

export class Rol extends Model {
    declare id_rol: number;
    declare nombre_rol: string;
}

Rol.init(
    {
        id_rol: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nombre_rol: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
    },
    {
        sequelize,
        tableName: 'rol',
    }
);
