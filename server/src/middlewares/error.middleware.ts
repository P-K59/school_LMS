import { Request, Response, NextFunction } from "express";
import ApiError from "../config/ApiError";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";
  let errors = err.errors || [];

  // Log the error for development debugging
  console.error("API Error occurred:", err);

  // Custom handling for Prisma Client Validation Errors or other errors
  if (err.name === "PrismaClientValidationError") {
    statusCode = 400;
    message = "Database validation failed. Please check the request parameters.";
  } else if (err.code && err.code.startsWith("P")) {
    // Handle specific Prisma database errors (P2002 unique constraint, etc.)
    if (err.code === "P2002") {
      statusCode = 409;
      message = `Duplicate value error: A record with this unique value already exists.`;
    } else {
      statusCode = 400;
      message = `Database operation failed: ${err.message}`;
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
