export class ApiResponse {
  constructor(statusCode, data = null, message = "Success", meta = {}) {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
    if (Object.keys(meta).length) this.meta = meta;
  }
}