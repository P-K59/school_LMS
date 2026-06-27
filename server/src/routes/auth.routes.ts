import { Router } from "express";
import * as authController from "../controllers/auth.controller"
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// @desc Register School
// @route POST /api/v1/auth/register-school
router.post("/register-school", authController.registerSchool);

// @desc Login
// @route POST /api/v1/auth/login
router.post("/login", authController.login);

// @desc Get Current User
// @route GET /api/v1/auth/me
router.get("/me",authenticate, authController.getCurrentUser);

export default router;