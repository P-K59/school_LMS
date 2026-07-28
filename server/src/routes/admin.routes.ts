import { Router } from "express";
import { UserRole } from "@prisma/client";

import {
    getDashboard,
    publishCourse,
    archiveCourse,
} from "../controllers/admin.controller";

import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

router.use(authenticate);

router.use(
    authorize(
        UserRole.SCHOOL_ADMIN,
        UserRole.SUPER_ADMIN
    )
);

router.get("/dashboard", getDashboard);

router.patch(
    "/courses/:courseId/publish",
    publishCourse
);

router.patch(
    "/courses/:courseId/archive",
    archiveCourse
);

export default router;