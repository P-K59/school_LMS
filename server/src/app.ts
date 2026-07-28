require("dotenv").config();
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { prisma } from "./config/db";
import path from "path";

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

app.use(
    "/uploads",
    express.static(path.join(process.cwd(), "uploads"))
);



// importing routes
import authRoutes from "./routes/auth.routes";
import courseRoutes from "./routes/course.routes";
import { errorHandler } from "./middlewares/error.middleware";
import adminRoutes from "./routes/admin.routes";
import moduleRoutes from "./routes/module.routes";
import lessonRoutes from "./routes/lesson.routes";
import enrollmentRoutes from "./routes/enrollment.routes";
import uploadRoutes from "./routes/upload.routes";


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/modules", moduleRoutes);
app.use("/api/v1/lessons", lessonRoutes);
app.use("/api/v1/enrollments", enrollmentRoutes);
app.use("/api/v1/upload", uploadRoutes);




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

