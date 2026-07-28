import { RequestHandler } from "express";
import adminService from "../services/admin.service";
import catchAsync from "../config/catchAsync";

// Dashboard
export const getDashboard: RequestHandler = catchAsync(async (req, res) => {
    const schoolId = req.user!.schoolId;

    const data = await adminService.getDashboard(schoolId);

    res.status(200).json({
        success: true,
        data,
    });
});

// Publish Course
export const publishCourse: RequestHandler = catchAsync(async (req, res) => {
    const course = await adminService.publishCourse(req.params.courseId);

    res.status(200).json({
        success: true,
        message: "Course published successfully.",
        data: course,
    });
});

// Archive Course
export const archiveCourse: RequestHandler = catchAsync(async (req, res) => {
    const course = await adminService.archiveCourse(req.params.courseId);

    res.status(200).json({
        success: true,
        message: "Course archived successfully.",
        data: course,
    });
});