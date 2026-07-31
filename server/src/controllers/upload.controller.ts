import { RequestHandler } from "express";
import catchAsync from "../config/catchAsync";
import uploadService from "../services/upload.service";

export const uploadVideo: RequestHandler = catchAsync(async (req, res) => {

    const result = uploadService.uploadVideo(
        (req as any).file
    );

    res.status(201).json({
        success: true,
        message: "Video uploaded successfully.",
        data: result,
    });
});

export const uploadPdf: RequestHandler = catchAsync(async (req, res) => {

    const result = uploadService.uploadPdf(
        (req as any).file
    );

    res.status(201).json({
        success: true,
        message: "PDF uploaded successfully.",
        data: result,
    });
});

export const uploadImage: RequestHandler = catchAsync(async (req, res) => {

    const result = uploadService.uploadImage(
        (req as any).file
    );

    res.status(201).json({
        success: true,
        message: "Image uploaded successfully.",
        data: result,
    });
});

export const deleteFile: RequestHandler = catchAsync(async (req, res) => {

    const result = await uploadService.deleteFile(
        req.body.fileUrl
    );

    res.status(200).json(result);
});