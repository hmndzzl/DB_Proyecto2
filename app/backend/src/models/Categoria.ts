import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize';

export class Categoria extends Model {
    public id_categoria!: number;
    public nombre_categoria!: string;
    public descripcion_categoria!: string | null;
}

Categoria.init(
    {
        id_categoria: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nombre_categoria: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        descripcion_categoria: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'categoria',
    }
);
export default Categoria;
