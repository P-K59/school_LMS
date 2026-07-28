import { Router } from "express";
import { UserRole } from "@prisma/client";

import {
    createLesson,
    getLessons,
    getLesson,
    updateLesson,
    deleteLesson,
    reorderLessons,
} from "../controllers/lesson.controller";

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

router.post("/:moduleId", createLesson);

router.get("/module/:moduleId", getLessons);

router.get("/:id", getLesson);

router.patch("/:id", updateLesson);

router.delete("/:id", deleteLesson);

router.patch(
    "/module/:moduleId/reorder",
    reorderLessons
);

export default router;