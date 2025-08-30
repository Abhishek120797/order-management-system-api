import { DataTypes } from "sequelize";
import sequelizeInstance from "../config/sequelizeInstance.js";

const Inventory = sequelizeInstance.define(
    "Inventory",
    {
        inventoryID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        productID: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "products", key: "productID" },
            onDelete: "RESTRICT",
            onUpdate: "CASCADE",
        },
        supplierID: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "users", key: "userID" },
            onDelete: "RESTRICT",
            onUpdate: "CASCADE",
        },
        changeQTY: {
            type: DataTypes.DECIMAL(12, 3),
            allowNull: false,
        },
        reason: {
            type: DataTypes.ENUM("ORDER", "RESTOCK", "ADJUSTMENT", "RETURN"),
            allowNull: false,
        },
    },
    {
        tableName: "inventory",
        timestamps: true,
        indexes: [{ fields: ["productID"] }, { fields: ["supplierID"] }],
    }
);

export default Inventory;
