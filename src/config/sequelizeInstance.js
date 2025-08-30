import dotenv from "dotenv";
dotenv.config();

import { Sequelize } from "sequelize";

import { db_name } from "../constants.js";

const sequelizeInstance = new Sequelize(
    db_name,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres",
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
        retry: {
            max: 5, // retry failed connections
        },
    }
);

export default sequelizeInstance;
