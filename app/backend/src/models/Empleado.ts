import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize';
import { Rol } from './Rol';

export class Empleado extends Model {
    public id_empleado!: number;
    public nombre_empleado!: string;
    public correo_empleado!: string;
    public password_empleado!: string;
    public fecha_contratacion!: Date;
    public id_rol!: number;
    public id_encargado!: number | null;
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
