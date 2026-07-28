import { RequestHandler } from "express";
import catchAsync from "../config/catchAsync";
import lessonService from "../services/lesson.service";

// @desc Create Lesson
// @route POST /api/v1/lessons/:moduleId
// @access Private
export const createLesson: RequestHandler = catchAsync(async (req, res) => {

    const lesson = await lessonService.createLesson(
        req.params.moduleId,
        req.body
    );

    res.status(201).json({
        success: true,
        message: "Lesson created successfully.",
        data: lesson,
    });
});

// @desc Get Lessons
// @route GET /api/v1/lessons/module/:moduleId
// @access Private
export const getLessons: RequestHandler = catchAsync(async (req, res) => {

    const lessons = await lessonService.getLessons(
        req.params.moduleId
    );

    res.status(200).json({
        success: true,
        count: lessons.length,
        data: lessons,
    });
});

// @desc Get Lesson
// @route GET /api/v1/lessons/:id
// @access Private
export const getLesson: RequestHandler = catchAsync(async (req, res) => {

    const lesson = await lessonService.getLesson(
        req.params.id
    );

    res.status(200).json({
        success: true,
        data: lesson,
    });
});

// @desc Update Lesson
// @route PATCH /api/v1/lessons/:id
// @access Private
export const updateLesson: RequestHandler = catchAsync(async (req, res) => {

    const lesson = await lessonService.updateLesson(
        req.params.id,
        req.body
    );

    res.status(200).json({
        success: true,
        message: "Lesson updated successfully.",
        data: lesson,
    });
});

// @desc Delete Lesson
// @route DELETE /api/v1/lessons/:id
// @access Private
export const deleteLesson: RequestHandler = catchAsync(async (req, res) => {

    await lessonService.deleteLesson(req.params.id);

    res.status(200).json({
        success: true,
        message: "Lesson deleted successfully.",
    });
});

// @desc Reorder Lessons
// @route PATCH /api/v1/lessons/module/:moduleId/reorder
// @access Private
export const reorderLessons: RequestHandler = catchAsync(async (req, res) => {

    const result = await lessonService.reorderLessons(
        req.params.moduleId,
        req.body.lessonIds
    );

    res.status(200).json(result);
});