import ErrorHandler from "../utils/errorHandler.js";


export default (err, req, res, next) => {
  let error = {
    statusCode: err?.statusCode || 500,
    message: err?.message || "Internal Server Error",
  };

  if (err.name === "CastError") {
    const message = `Resource not found, Invalid ${err?.path}`;
    error = new ErrorHandler(message, 404);
  }

  if (err.name === "ValidatonError") {
    const message = Object.values(err.errors).map((me) => me.message);
    error = new ErrorHandler(message, 400);
  }
  // handle Mongoose Duplicate key error

  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    error = new ErrorHandler(message, 400);
  }

  // Handle wrong JWT error

  if (err.name === "JsonWebTokenError") {
    const message = `JSON Web Token is invalid. Please try again`;
    error = new ErrorHandler(message, 400);
  }

  // Handle expired JWT error

  if (err.name === "TokenExpiredError") {
    const message = `JSON Web Token is expired. Please try again`;
    error = new ErrorHandler(message, 400);
  }






  if (process.env.NODE_ENV === "DEVELOPMENT") {
    res.status(error.statusCode).json({
      message: error.message,
      error: err,
      stack: err.stack,
    });
  }

  if (process.env.NODE_ENV === "PRODUCTION") {
    res.status(error.statusCode).json({
      message: error.message,
    });
  }

  res.status(error.statusCode).json({
    message: error.message,
  });
}