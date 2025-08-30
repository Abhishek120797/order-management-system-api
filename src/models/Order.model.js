import { DataTypes } from "sequelize";
import sequelizeInstance from "../config/sequelizeInstance.js";

const Order = sequelizeInstance.define(
    "Order",
    {
        orderID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        buyerID: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "users", key: "userID" },
            onDelete: "RESTRICT",
            onUpdate: "CASCADE",
        },
        status: {
            type: DataTypes.ENUM(
                "PENDING",
                "APPROVED",
                "FULFILLED",
                "CANCELLED"
            ),
            allowNull: false,
            defaultValue: "PENDING",
        },
        totalAmount: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        tableName: "orders",
        timestamps: true,
        paranoid: true,
        indexes: [{ fields: ["buyerID"] }],
    }
);

export default Order;
