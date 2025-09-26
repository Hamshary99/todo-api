export class ApiError extends Error {
  constructor(message, statusCode, type = "api_error") {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError";
    this.type = type;
  }
}

export const handleError = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: "error",
      type: err.type,
      message: err.message,
      statusCode: err.statusCode,
      timeStamp: new Date().toISOString(),
    });
  } else
    return res.status(err.statusCode || 500).json({
      status: "error",
      type: "unexpected_error",
      message: err.message || "Unexpected error",
      statusCode: err.statusCode || 500,
      timeStamp: new Date().toISOString(),
    });
};
