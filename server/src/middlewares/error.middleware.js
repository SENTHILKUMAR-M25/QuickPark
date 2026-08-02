import { ApiError } from "../utils/ApiError.js";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

export function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;

  if (statusCode >= 500) {
    logger.error("Unhandled error", err);
  }

  if (env.isDev && statusCode >= 500) {
    console.error(err.stack);
  }

  const response = {
    success: false,
    message: statusCode >= 500 ? "Internal server error." : err.message || "Something went wrong.",
  };

  if (err.details) response.details = err.details;
  if (env.isDev && statusCode >= 500) response.stack = err.stack;

  res.status(statusCode).json(response);
}