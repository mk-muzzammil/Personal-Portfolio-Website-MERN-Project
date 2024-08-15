class customeError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const globalErrorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;
  if (err.statusCode === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} field entered`;
    err = new customeError(message, 400);
  }
  if (err.message === "JsonWebTokenError") {
    const message = `Invalid token. Please login again`;
    err = new customeError(message, 400);
  }
  if (err.message === "TokenExpiredError") {
    const message = `Token expired. Please login again`;
    err = new customeError(message, 400);
  }
  if (err.message === "CastError") {
    const message = `Invalid ${err.path}: ${err.value}`;
    err = new customeError(message, 400);
  }
  const errorMessage = err.errors
    ? Object.values(err.errors)
        .map((error) => error.message)
        .join(" ")
    : err.message;

  return res.status(err.statusCode).json({
    success: false,
    error: errorMessage,
  });
};

export default customeError;
