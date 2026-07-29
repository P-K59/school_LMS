import { Router } from "express";

import {
    getAdminDashboard,
    getStudentDashboard,
} from "../controllers/dashboard.controller";

import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

router.get(
    "/admin",
    authenticate,
    authorize("SCHOOL_ADMIN"),
    getAdminDashboard
);

router.get(
    "/student",
    authenticate,
    authorize("STUDENT"),
    getStudentDashboard
);

export default router;