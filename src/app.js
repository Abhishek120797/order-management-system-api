import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import helmet from "helmet";
import { ApiError } from "./utils/ApiError.js";
import { ApiResponse } from "./utils/ApiResponse.js";

const app = express();

// trust proxy (needed for reverse proxies like Nginx)
app.set("trust proxy", 1);

// Helmet (security headers)
app.use(
    helmet({
        contentSecurityPolicy:
            process.env.NODE_ENV === "production" ? undefined : false,
    })
);

// CORS
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

// Body parsers
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static("public"));

// Cookie parser
app.use(cookieParser());

// Rate limiter (apply only on API routes in prod)
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later.",
});

const isDev = process.env.NODE_ENV === "development";

if (!isDev) {
    app.use("/api", limiter);
}

// Logging (only in development)
if (isDev) {
    app.use(morgan("dev"));
}

// Routes
app.get("/api/v1/ping", (req, res) => {
    res.status(200).json(
        new ApiResponse(200, { pong: true }, "ping successful")
    );
});

// 404 handler
app.use((req, res, next) => {
    next(new ApiError(404));
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
    // If it's not an ApiError, wrap it into one
    if (!(err instanceof ApiError)) {
        err = new ApiError(
            err.statusCode || 500,
            err.message || "Internal Server Error",
            err.errors || [],
            err.stack
        );
        err.isOperational = false; // unexpected error
    }
    const { statusCode, isOperational, errors } = err;

    // Log the error differently depending on type
    if (isOperational) {
        console.error("[Operational Error]", err.message);
    } else {
        console.error("[Programming/Error Bug] ", err);
    }

    // Show stack trace only in development
    if (isDev) {
        console.error(err.stack);
    }

    // Decide what message to send to client
    const clientMessage =
        !isDev && !isOperational ? "Internal Server Error" : err.message;

    return res
        .status(statusCode)
        .json(new ApiResponse(statusCode, null, clientMessage, errors || []));
});

export { app };
