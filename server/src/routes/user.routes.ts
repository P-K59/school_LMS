import { Router } from "express";
import { UserRole } from "@prisma/client";

import userController from "../controllers/user.controller";

import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Only admins can manage students
router.use(
    authorize(
        UserRole.SUPER_ADMIN,
        UserRole.SCHOOL_ADMIN
    )
);

// Create Student
router.post(
    "/students",
    userController.createStudent
);

// Get All Students
router.get(
    "/students",
    userController.getStudents
);

// Get Single Student
router.get(
    "/students/:id",
    userController.getStudent
);

// Update Student
router.patch(
    "/students/:id",
    userController.updateStudent
);

// Soft Delete Student
router.delete(
    "/students/:id",
    userController.deleteStudent
);

export default router;