const { ZodError } = require("zod");
const AppError = require("../utils/AppError");

const errorHandler = (err, req, res, next) => {
  // Zod validation error
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Validation error",
      issues: err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  // App-defined errors (custom)
  if (err instanceof AppError) {
    return res.json({
      statusCode: err.statusCode,
      errors: err.message,
    });
  }

  // Unexpected / unknown errors
  console.error("Unhandled Error:", err.message);
  res.status(500).json({
    error: "Internal Server Error",
  });
};

module.exports = errorHandler;
