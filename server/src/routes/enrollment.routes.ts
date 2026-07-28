import { Router } from "express";
import { UserRole } from "@prisma/client";

import {
    enroll,
    getMyCourses,
    getCourseStudents,
    updateProgress,
    unenroll,
} from "../controllers/enrollment.controller";

import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

router.use(authenticate);

// Student + Admin
router.post(
    "/enroll/:courseId",
    authorize(
        UserRole.STUDENT,
        UserRole.SCHOOL_ADMIN,
        UserRole.SUPER_ADMIN
    ),
    enroll
);

router.get(
    "/my-courses",
    authorize(
        UserRole.STUDENT,
        UserRole.SCHOOL_ADMIN,
        UserRole.SUPER_ADMIN
    ),
    getMyCourses
);

router.patch(
    "/progress/:courseId",
    authorize(
        UserRole.STUDENT
    ),
    updateProgress
);

router.delete(
    "/unenroll/:courseId",
    authorize(
        UserRole.STUDENT,
        UserRole.SCHOOL_ADMIN
    ),
    unenroll
);

router.get(
    "/course/:courseId/students",
    authorize(
        UserRole.SCHOOL_ADMIN,
        UserRole.SUPER_ADMIN
    ),
    getCourseStudents
);

export default router;