class ApiResponse {
    constructor(statusCode, data = null, message = "success", errors = []) {
        this.statusCode = statusCode;
        this.success = statusCode >= 200 && statusCode < 300;
        this.data = data;
        this.message = message;
        this.errors = errors;
    }
}

export { ApiResponse };
