import { Router } from "express";
import { UserRole } from "@prisma/client";

import {
    createCourse,
    getCourses,
    getCourse,
    updateCourse,
    deleteCourse,
    publishCourse,
    archiveCourse,
} from "../controllers/course.controller";

import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

// Authentication
router.use(authenticate);

// All course routes require School Admin or Super Admin
router.use(
    authorize(
        UserRole.SCHOOL_ADMIN,
        UserRole.SUPER_ADMIN
    )
);

// CRUD
router.post("/", createCourse);

router.get("/", getCourses);

router.get("/:id", getCourse);

router.patch("/:id", updateCourse);

router.delete("/:id", deleteCourse);

// Course Status
router.patch("/:id/publish", publishCourse);

router.patch("/:id/archive", archiveCourse);

export default router;