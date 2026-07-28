import { Router } from "express";
import * as courseController from "../controllers/course.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.use(authenticate);

router.post("/", courseController.createCourse);

router.get("/", courseController.getCourses);

router.get("/:id", courseController.getCourse);

router.patch("/:id", courseController.updateCourse);

router.delete("/:id", courseController.deleteCourse);

export default router;