import { STATUS_CODES } from "./app-errors.js";

class BaseResponse {
    constructor(res, status = true, statusCode = STATUS_CODES.OK, message, data = null) {
        this.res = res;
        this.status = status;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.sendResponse();
    }

    // Method to send the response automatically
    sendResponse() {
        return this.res.status(this.statusCode).json({
            status: this.status,
            statusCode: this.statusCode,
            message: this.message,
            data: this.data
        });
    }
}

class APIResponse extends BaseResponse {
    constructor(res, message, data = null, status=true, statusCode = STATUS_CODES.OK) {
        super(res, status, statusCode, message, data);
    }
}

export { APIResponse };
