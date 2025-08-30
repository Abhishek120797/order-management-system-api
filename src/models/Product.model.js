import { DataTypes } from "sequelize";
import sequelizeInstance from "../config/sequelizeInstance.js";

const Product = sequelizeInstance.define(
    "Product",
    {
        productID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        supplierID: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "users", key: "userID" },
            onDelete: "RESTRICT",
            onUpdate: "CASCADE",
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(250),
        },
        baseUOM: {
            type: DataTypes.ENUM("KG", "GM", "LT", "ML", "PCS"),
            allowNull: false,
        },
        conversionFactor: {
            type: DataTypes.DECIMAL(10, 4),
            allowNull: false,
            defaultValue: 1,
        },
        pricePerUnit: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        stockQuantity: {
            type: DataTypes.DECIMAL(12, 3),
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        tableName: "products",
        timestamps: true,
        paranoid: true,
        indexes: [
            { fields: ["supplierID"] },
            { unique: true, fields: ["supplierID", "name"] }, // prevent duplicate names per supplier
        ],
    }
);

export default Product;
