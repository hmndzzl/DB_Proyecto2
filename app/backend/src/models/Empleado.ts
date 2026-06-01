import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize';
import { Rol } from './Rol';

export class Empleado extends Model {
    declare id_empleado: number;
    declare nombre_empleado: string;
    declare correo_empleado: string;
    declare password_empleado: string;
    declare fecha_contratacion: Date;
    declare id_rol: number;
    declare id_encargado: number | null;
}

Empleado.init(
    {
        id_empleado: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nombre_empleado: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        correo_empleado: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        password_empleado: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        fecha_contratacion: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        id_rol: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Rol,
                key: 'id_rol',
            },
        },
        id_encargado: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'empleado',
                key: 'id_empleado',
            },
        },
    },
    {
        sequelize,
        tableName: 'empleado',
    }
);

Empleado.belongsTo(Rol, { foreignKey: 'id_rol', as: 'rol' });
Empleado.belongsTo(Empleado, { foreignKey: 'id_encargado', as: 'encargado' });
export default Empleado;
