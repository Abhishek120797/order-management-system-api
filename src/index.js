import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { app } from "./app.js";
import sequelizeInstance from "./config/sequelizeInstance.js";
import connectDB from "./config/database.js";

const port = process.env.PORT || 3000;

const server = http.createServer(app);

const startServer = async () => {
    try {
        await connectDB();
        console.log("Database connected successfully.");
        server.listen(port, () => {
            console.log(
                ` Server running in ${process.env.NODE_ENV} mode on port ${port}`
            );
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();

const shutDown = async (signal) => {
    console.log(`\n${signal} received, shutting down gracefully...`);
    try {
        await sequelizeInstance.close();
        console.log("Database connection closed.");
    } catch (dbError) {
        console.error("Failed to close database connection:", dbError);
    }

    server.close((err) => {
        if (err) {
            console.error("Failed to close server:", err);
            process.exit(1);
        }
        console.log("Server closed.");
        process.exit(0);
    });
};

process.on("SIGINT", () => shutDown("SIGINT"));

process.on("SIGTERM", () => shutDown("SIGTERM"));

process.on("uncaughtException", (err) => {
    console.error(err);
    shutDown("uncaughtException");
});

process.on("unhandledRejection", (err) => {
    console.error(err);
    shutDown("unhandledRejection");
});

server.on("error", (err) => {
    console.error("server error:", err);
    process.exit(1);
});
