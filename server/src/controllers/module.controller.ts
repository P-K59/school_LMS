import { RequestHandler } from "express";
import catchAsync from "../config/catchAsync";
import moduleService from "../services/module.service";

// @desc Create Module
// @route POST /api/v1/modules/:courseId
// @access Private
export const createModule: RequestHandler = catchAsync(async (req, res) => {

    const module = await moduleService.createModule(
        req.params.courseId,
        req.body
    );

    res.status(201).json({
        success: true,
        message: "Module created successfully.",
        data: module,
    });
});

// @desc Get All Modules
// @route GET /api/v1/modules/course/:courseId
// @access Private
export const getModules: RequestHandler = catchAsync(async (req, res) => {

    const modules = await moduleService.getModules(
        req.params.courseId
    );

    res.status(200).json({
        success: true,
        count: modules.length,
        data: modules,
    });
});

// @desc Get Module
// @route GET /api/v1/modules/:id
// @access Private
export const getModule: RequestHandler = catchAsync(async (req, res) => {

    const module = await moduleService.getModule(
        req.params.id
    );

    res.status(200).json({
        success: true,
        data: module,
    });
});

// @desc Update Module
// @route PATCH /api/v1/modules/:id
// @access Private
export const updateModule: RequestHandler = catchAsync(async (req, res) => {

    const module = await moduleService.updateModule(
        req.params.id,
        req.body
    );

    res.status(200).json({
        success: true,
        message: "Module updated successfully.",
        data: module,
    });
});

// @desc Delete Module
// @route DELETE /api/v1/modules/:id
// @access Private
export const deleteModule: RequestHandler = catchAsync(async (req, res) => {

    await moduleService.deleteModule(
        req.params.id
    );

    res.status(200).json({
        success: true,
        message: "Module deleted successfully.",
    });
});

// @desc Reorder Modules
// @route PATCH /api/v1/modules/course/:courseId/reorder
// @access Private
export const reorderModules: RequestHandler = catchAsync(async (req, res) => {

    const result = await moduleService.reorderModules(
        req.params.courseId,
        req.body.moduleIds
    );

    res.status(200).json(result);
});