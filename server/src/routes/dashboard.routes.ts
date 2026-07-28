import { Router } from "express";
import { UserRole } from "@prisma/client";

import dashboardController from "../controllers/dashboard.controller";

import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

router.use(authenticate);

router.get(
    "/admin",
    authorize(
        UserRole.SUPER_ADMIN,
        UserRole.SCHOOL_ADMIN
    ),
    dashboardController.getAdminDashboard
);

export default router;