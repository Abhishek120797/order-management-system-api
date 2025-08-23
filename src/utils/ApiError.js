class ApiError extends Error {
    constructor(statusCode = 500, message, errors = [], stack = "") {
        const defaultMessages = {
            400: "Bad Request",
            401: "Unauthorized",
            403: "Forbidden",
            404: "Not Found",
            408: "Request Timeout",
            409: "Conflict",
            422: "Unprocessable Entity",
            429: "Too Many Requests",
            500: "Internal Server Error",
            502: "Bad Gateway",
            503: "Service Unavailable",
            504: "Gateway Timeout",
        };
        super(message || defaultMessages[statusCode] || "Something went wrong");

        this.statusCode = statusCode;
        this.errors = errors;

        // Automatically decide if error is operational
        if (statusCode >= 400 && statusCode < 500) {
            this.isOperational = true; // client errors → expected
        } else {
            this.isOperational = false; // server errors → unexpected by default
        }

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };
