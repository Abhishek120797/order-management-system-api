import dotenv from "dotenv";
dotenv.config();

import { app } from "./app.js";

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
    console.log(`Server started at port number : ${PORT}`);
});

server.on("error", (error) => {
    console.error("Server error : ", error);
    process.exit(1);
});

//Gracefull shutdown system

const shutdown = async (signal) => {
    console.log(`\n ${signal} received. Closing server...`);

    server.close(async (err) => {
        if (err) {
            console.error("Error while closing server: ", err);
            process.exit(1);
        }

        try {
            console.log("database connection closed.");
            console.log("server shutdown complete.");
            process.exit(0);
        } catch (dbError) {
            console.error("Error during shutdown :", dbError);
            process.exit(1);
        }
    });
};

//Handle termination signal
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

// Catch Unhandled promise rejections
process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection: ", reason);
    shutdown("unhandledRejection");
});

// Catch uncaught exceptions

process.on("uncaughtException", (error) => {
    console.error("Uncaught exception:", error);
    shutdown("uncaughtException");
});
