import { RequestHandler } from "express";
import ApiResponse from "../config/ApiResponse";
import catchAsync from "../config/catchAsync";
import courseService from "../services/course.service";

export const createCourse: RequestHandler = catchAsync(async (req, res) => {

    const course = await courseService.createCourse(
        req.body,
        req.user
    );

    return res.status(201).json(
        new ApiResponse(
            201,
            "Course created successfully.",
            course
        )
    );
});

export const getCourses: RequestHandler = catchAsync(async (req, res) => {

    const courses = await courseService.getCourses(
        req.user!.schoolId!
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            "Courses fetched successfully.",
            courses
        )
    );
});

export const getCourse: RequestHandler = catchAsync(async (req, res) => {

    const course = await courseService.getCourse(req.params.id);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Course fetched successfully.",
            course
        )
    );
});

export const updateCourse: RequestHandler = catchAsync(async (req, res) => {

    const course = await courseService.updateCourse(
        req.params.id,
        req.body
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            "Course updated successfully.",
            course
        )
    );
});

export const deleteCourse: RequestHandler = catchAsync(async (req, res) => {

    await courseService.deleteCourse(req.params.id);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Course deleted successfully."
        )
    );
});