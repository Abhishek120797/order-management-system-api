import { DataTypes } from "sequelize";
import sequelizeInstance from "../config/sequelizeInstance.js";

const OrderStatusHistory = sequelizeInstance.define(
    "OrderStatusHistory",
    {
        statusHistoryID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        orderID: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "orders", key: "orderID" },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
        oldStatus: {
            type: DataTypes.ENUM(
                "PENDING",
                "APPROVED",
                "FULFILLED",
                "CANCELLED"
            ),
        },
        newStatus: {
            type: DataTypes.ENUM(
                "PENDING",
                "APPROVED",
                "FULFILLED",
                "CANCELLED"
            ),
            allowNull: false,
        },
        changedBy: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "users", key: "userID" },
            onDelete: "RESTRICT",
            onUpdate: "CASCADE",
        },
    },
    {
        tableName: "order_status_history",
        timestamps: true,
        createdAt: "changed_at",
        updatedAt: false,
        indexes: [{ fields: ["orderID"] }],
    }
);

export default OrderStatusHistory;
