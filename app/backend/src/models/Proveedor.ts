import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize';

export class Proveedor extends Model {
    declare id_proveedor: number;
    declare nombre_proveedor: string;
}

Proveedor.init(
    {
        id_proveedor: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nombre_proveedor: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'proveedor',
    }
);
export default Proveedor;
