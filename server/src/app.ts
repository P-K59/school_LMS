require("dotenv").config();
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { prisma } from "./config/db";

export const app = express();

// body parser middleware
app.use(express.json({ limit: "50mb" }));

// cookie parser middleware
app.use(cookieParser());

// cors middleware
app.use(cors({
  origin: process.env.ORIGIN,
  credentials: true,
}));



// importing routes
import authRoutes from "./routes/auth.routes";
import schoolAdminRoutes from "./routes/schoolAdmin.routes";
import { errorHandler } from "./middlewares/error.middleware";

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/school-admin", schoolAdminRoutes);



// health check route
app.get(
  "/health",
  (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: "Server is up and running",
      data: {
        server: "UP",
      },
      timestamp: new Date().toISOString(),
    });
  }
);

// unknown route handler
app.all(
  "*",
  (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
      success: false,
      message: "Route not found",
    });
  }
);

// global error handler
app.use(errorHandler);

