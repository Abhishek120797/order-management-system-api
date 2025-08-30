import { DataTypes } from "sequelize";
import sequelizeInstance from "../config/sequelizeInstance.js";
import Product from "./Product.model.js";
import Order from "./Order.model.js";

const OrderItem = sequelizeInstance.define(
    "OrderItem",
    {
        orderItemID: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        orderID: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "orders", key: "orderID" },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
        productID: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "products", key: "productID" },
            onDelete: "RESTRICT",
            onUpdate: "CASCADE",
        },
        orderedQTY: {
            type: DataTypes.DECIMAL(12, 3),
            allowNull: false,
        },
        uom: {
            type: DataTypes.ENUM("KG", "GM", "LT", "ML", "PCS"),
            allowNull: false,
        },
        baseQTY: {
            type: DataTypes.DECIMAL(12, 3),
            allowNull: false,
        },
        unitPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        lineTotal: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },
    },
    {
        tableName: "order_items",
        timestamps: true,
        indexes: [{ fields: ["orderID"] }, { fields: ["productID"] }],
        hooks: {
            beforeValidate: async (item) => {
                const product = await Product.findByPk(item.productID);
                if (product) {
                    // convert ordered qty to base qty
                    item.baseQTY = item.orderedQTY * product.conversionFactor;
                    // calculate line total
                    item.lineTotal = item.baseQTY * product.pricePerUnit;
                    item.unitPrice = product.pricePerUnit;
                }
            },
        },
    }
);

// After creating/updating items, recalc order total
OrderItem.addHook("afterSave", async (item) => {
    const order = await Order.findByPk(item.orderID, { include: ["items"] });
    if (order) {
        const total = order.items.reduce(
            (sum, i) => sum + parseFloat(i.lineTotal),
            0
        );
        await order.update({ totalAmount: total });
    }
});

export default OrderItem;
