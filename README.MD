# 📦 Mini Order Management System (OMS) API

A modular, scalable **RESTful API** for a fictional B2B **Order Management Platform** built with **Express.js** and **PostgreSQL**.  

This API allows **Suppliers** to list products, **Buyers** to place/manage orders, and **Admins** to control the order lifecycle and view analytics.  
Designed to demonstrate **production-grade structure**, **relational DB design**, **role-based authorization**, and **multi-step business logic** (inventory, UOM conversions, order status history).  

---

## 🚀 Features

### Buyer
- Browse products 
- Place orders with multiple items 
- View their orders with status history 
- Order in **dynamic units** (e.g., request `500 g` if product base unit is `kg`)

### Supplier
- Add / update products 
- Update stock
- View incoming orders

### Admin
- Change order status (Pending → Approved → Fulfilled/Cancelled)
- View order analytics
- Real-time order status updates via **WebSockets**
 

---

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js  
- **Database**: PostgreSQL (with Sequelize ORM)  
- **Auth & Security**: JWT, bcrypt, role-based authorization  
- **Validation**:  
- **Dev Tools**: Nodemon  

---

## 📦 Installation & Setup

### 1. Clone the repo
```bash
git clone https://github.com/Abhishek120797/order-management-system-api
cd order-management-system-api
