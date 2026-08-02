import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export function validate(schema, source = "body") {
  return asyncHandler(async (req, res, next) => {
    try {
      const result = schema.parse(req[source]);
      req[source] = result;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const details = err.issues.map((i) => ({
          field: i.path.join("."),
          message: i.message,
        }));
        throw new ApiError(422, "Validation failed", details);
      }
      throw err;
    }
  });
}

export default validate;