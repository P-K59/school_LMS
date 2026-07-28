import { RequestHandler } from "express";
import catchAsync from "../config/catchAsync";
import enrollmentService from "../services/enrollment.service";

// @desc Enroll in Course
// @route POST /api/v1/enrollments/enroll/:courseId
// @access Private
export const enroll: RequestHandler = catchAsync(async (req, res) => {

    const enrollment = await enrollmentService.enroll(
        req.user!.id,
        req.params.courseId
    );

    res.status(201).json({
        success: true,
        message: "Enrolled successfully.",
        data: enrollment,
    });
});

// @desc My Courses
// @route GET /api/v1/enrollments/my-courses
// @access Private
export const getMyCourses: RequestHandler = catchAsync(async (req, res) => {

    const courses = await enrollmentService.getMyCourses(
        req.user!.id
    );

    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses,
    });
});

// @desc Course Students
// @route GET /api/v1/enrollments/course/:courseId/students
// @access Private
export const getCourseStudents: RequestHandler = catchAsync(async (req, res) => {

    const students = await enrollmentService.getCourseStudents(
        req.params.courseId
    );

    res.status(200).json({
        success: true,
        count: students.length,
        data: students,
    });
});

// @desc Update Progress
// @route PATCH /api/v1/enrollments/progress/:courseId
// @access Private
export const updateProgress: RequestHandler = catchAsync(async (req, res) => {

    const enrollment = await enrollmentService.updateProgress(
        req.user!.id,
        req.params.courseId,
        req.body.progress
    );

    res.status(200).json({
        success: true,
        message: "Progress updated successfully.",
        data: enrollment,
    });
});

// @desc Unenroll
// @route DELETE /api/v1/enrollments/unenroll/:courseId
// @access Private
export const unenroll: RequestHandler = catchAsync(async (req, res) => {

    await enrollmentService.unenroll(
        req.user!.id,
        req.params.courseId
    );

    res.status(200).json({
        success: true,
        message: "Enrollment removed successfully.",
    });
});