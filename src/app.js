import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import { ApiError } from "./utils/ApiError.js";
import { ApiResponse } from "./utils/ApiResponse.js";

const app = express();

const inDev = process.env.NODE_ENV === "development";

app.set("trust proxy", 1);

//middlewares
app.use(
    helmet({
        contentSecurityPolicy: inDev ? false : undefined,
    })
);

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

if (inDev) {
    app.use(morgan("dev"));
}

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later.",
});

if (!inDev) {
    app.use("/api", limiter);
}

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(express.static("public"));

app.use(compression());

// Routes
app.get("/api/v1/ping", (req, res) => {
    res.status(200).json(
        new ApiResponse(200, { pong: true }, "ping successful")
    );
});

// 404 handler
app.use((req, res, next) => {
    next(new ApiError(404, "Resource not found"));
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
    if (!(err instanceof ApiError)) {
        err = new ApiError(
            err.statusCode || 500,
            err.message || "Internal Server Error",
            err.errors,
            err.stack
        );
        err.isOperational = false;
    }

    const { statusCode, isOperational, errors, message, stack } = err;

    if (isOperational) {
        console.error("[Operational Error]", message);
    } else {
        console.error("[Programming/Error Bug] ", err);
    }

    if (inDev && stack) {
        console.error(stack);
    }

    const clientMessage =
        !inDev && !isOperational ? "Internal Server Error" : message;

    return res
        .status(statusCode)
        .json(new ApiResponse(statusCode, null, clientMessage, errors));
});

export { app };
