import User from "./User.model.js";
import Product from "./Product.model.js";
import Order from "./Order.model.js";
import OrderItem from "./OrderItem.model.js";
import OrderStatusHistory from "./OrderStatusHistory.model.js";
import Inventory from "./Inventory.model.js";

const associateModels = () => {
    /** ---------------- USERS ↔ PRODUCTS (Supplier owns Products) ---------------- */
    User.hasMany(Product, {
        foreignKey: "supplierID",
        as: "supplierProducts",
    });
    Product.belongsTo(User, {
        foreignKey: "supplierID",
        as: "supplier",
    });

    /** ---------------- USERS ↔ ORDERS (Buyer places Orders) ---------------- */
    User.hasMany(Order, {
        foreignKey: "buyerID",
        as: "buyerOrders",
    });
    Order.belongsTo(User, {
        foreignKey: "buyerID",
        as: "buyer",
    });

    /** ---------------- ORDERS ↔ ORDER ITEMS ---------------- */
    Order.hasMany(OrderItem, {
        foreignKey: "orderID",
        as: "items",
    });
    OrderItem.belongsTo(Order, {
        foreignKey: "orderID",
        as: "order",
    });

    /** ---------------- PRODUCTS ↔ ORDER ITEMS ---------------- */
    Product.hasMany(OrderItem, {
        foreignKey: "productID",
        as: "orderItems",
    });
    OrderItem.belongsTo(Product, {
        foreignKey: "productID",
        as: "product",
    });

    /** ---------------- ORDERS ↔ STATUS HISTORY ---------------- */
    Order.hasMany(OrderStatusHistory, {
        foreignKey: "orderID",
        as: "statusHistory",
    });
    OrderStatusHistory.belongsTo(Order, {
        foreignKey: "orderID",
        as: "order",
    });

    /** ---------------- USERS ↔ STATUS HISTORY (Admin changes statuses) ---------------- */
    User.hasMany(OrderStatusHistory, {
        foreignKey: "changedBy",
        as: "statusChanges",
    });
    OrderStatusHistory.belongsTo(User, {
        foreignKey: "changedBy",
        as: "changedByUser",
    });

    /** ---------------- PRODUCTS ↔ INVENTORY ---------------- */
    Product.hasMany(Inventory, {
        foreignKey: "productID",
        as: "inventoryLogs",
    });
    Inventory.belongsTo(Product, {
        foreignKey: "productID",
        as: "product",
    });

    /** ---------------- USERS ↔ INVENTORY (Supplier logs stock changes) ---------------- */
    User.hasMany(Inventory, {
        foreignKey: "supplierID",
        as: "supplierInventoryLogs",
    });
    Inventory.belongsTo(User, {
        foreignKey: "supplierID",
        as: "supplier",
    });
};

export default associateModels;
