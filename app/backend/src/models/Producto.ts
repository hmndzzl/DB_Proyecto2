import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize';
import { Categoria } from './Categoria';
import { Proveedor } from './Proveedor';

export class Producto extends Model {
    declare id_producto: number;
    declare nombre_producto: string;
    declare precio_producto: number;
    declare stock_producto: number;
    declare id_categoria: number;
    declare id_proveedor: number;
}

Producto.init(
    {
        id_producto: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nombre_producto: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        precio_producto: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0.01,
            },
        },
        stock_producto: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
            },
        },
        id_categoria: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Categoria,
                key: 'id_categoria',
            },
        },
        id_proveedor: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Proveedor,
                key: 'id_proveedor',
            },
        },
    },
    {
        sequelize,
        tableName: 'producto',
    }
);

Producto.belongsTo(Categoria, { foreignKey: 'id_categoria', as: 'categoria' });
Producto.belongsTo(Proveedor, { foreignKey: 'id_proveedor', as: 'proveedor' });
export default Producto;
