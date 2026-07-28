import { Router } from "express";
import { UserRole } from "@prisma/client";

import {
    createModule,
    getModules,
    getModule,
    updateModule,
    deleteModule,
    reorderModules,
} from "../controllers/module.controller";

import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

// Authentication
router.use(authenticate);

// Authorization
router.use(
    authorize(
        UserRole.SCHOOL_ADMIN,
        UserRole.SUPER_ADMIN
    )
);

// Create Module
router.post("/:courseId", createModule);

// Get Modules of a Course
router.get("/course/:courseId", getModules);

// Get Single Module
router.get("/:id", getModule);

// Update Module
router.patch("/:id", updateModule);

// Delete Module
router.delete("/:id", deleteModule);

// Reorder Modules
router.patch(
    "/course/:courseId/reorder",
    reorderModules
);

export default router;