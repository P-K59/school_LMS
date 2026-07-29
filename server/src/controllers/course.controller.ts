import { RequestHandler } from "express";
import catchAsync from "../config/catchAsync";
import courseService from "../services/course.service";

// @desc Create Course
// @route POST /api/v1/courses
// @access Private (School Admin)
export const createCourse: RequestHandler = catchAsync(async (req, res) => {

    const course = await courseService.createCourse(
        req.body,
        req.user
    );

    res.status(201).json({
        success: true,
        message: "Course created successfully.",
        data: course,
    });
});

// @desc Get All Courses
// @route GET /api/v1/courses
// @access Private
export const getCourses: RequestHandler = catchAsync(async (req, res) => {

    const courses = await courseService.getCourses(
        req.user!.schoolId!
    );

    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses,
    });
});

// @desc Get Single Course
// @route GET /api/v1/courses/:id
// @access Private
export const getCourse: RequestHandler = catchAsync(async (req, res) => {

    const course = await courseService.getCourse(
        req.params.id,
        req.user!.schoolId!
    );

    res.status(200).json({
        success: true,
        data: course,
    });
});

// @desc Update Course
// @route PATCH /api/v1/courses/:id
// @access Private
export const updateCourse: RequestHandler = catchAsync(async (req, res) => {

    const course = await courseService.updateCourse(
        req.params.id,
        req.body,
        req.user!.schoolId!
    );

    res.status(200).json({
        success: true,
        message: "Course updated successfully.",
        data: course,
    });
});

// @desc Delete Course
// @route DELETE /api/v1/courses/:id
// @access Private
export const deleteCourse: RequestHandler = catchAsync(async (req, res) => {

    await courseService.deleteCourse(
        req.params.id,
        req.user!.schoolId!
    );

    res.status(200).json({
        success: true,
        message: "Course deleted successfully.",
    });
});

// @desc Publish Course
// @route PATCH /api/v1/courses/:id/publish
// @access Private
export const publishCourse: RequestHandler = catchAsync(async (req, res) => {

    const course = await courseService.publishCourse(req.params.id);

    res.status(200).json({
        success: true,
        message: "Course published successfully.",
        data: course,
    });
});

// @desc Archive Course
// @route PATCH /api/v1/courses/:id/archive
// @access Private
export const archiveCourse: RequestHandler = catchAsync(async (req, res) => {

    const course = await courseService.archiveCourse(req.params.id);

    res.status(200).json({
        success: true,
        message: "Course archived successfully.",
        data: course,
    });
});

export const getPublishedCourses: RequestHandler = catchAsync(async (req, res) => {

    const courses = await courseService.getPublishedCourses(
        req.user!.schoolId!
    );

    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses,
    });

});