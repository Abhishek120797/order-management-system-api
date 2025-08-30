import { DataTypes } from "sequelize";
import sequelizeInstance from "../config/sequelizeInstance.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const User = sequelizeInstance.define(
    "User",
    {
        userID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        firstName: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate: { isEmail: true },
        },
        contact: {
            type: DataTypes.STRING(15),
            allowNull: false,
            validate: {
                is: /^[0-9]{7,15}$/,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM("BUYER", "SUPPLIER", "ADMIN"),
            defaultValue: "BUYER",
            allowNull: false,
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        verificationCode: {
            type: DataTypes.STRING,
        },
        refreshToken: {
            type: DataTypes.STRING,
        },
    },
    {
        tableName: "users",
        timestamps: true,
        paranoid: true,
        hooks: {
            beforeCreate: async (user) => {
                if (user.password) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            },
            beforeUpdate: async (user) => {
                if (user.changed("password")) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            },
        },
    }
);

// Methods
User.prototype.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

User.prototype.generateAccessToken = function () {
    return jwt.sign(
        {
            userID: this.userID,
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            role: this.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

User.prototype.generateRefreshToken = function () {
    return jwt.sign({ userID: this.userID }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    });
};

export default User;
