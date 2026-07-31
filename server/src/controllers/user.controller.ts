import { Request, Response } from "express";

import catchAsync from "../config/catchAsync";
import userService from "../services/user.service";


class UserController {

    createStudent = catchAsync(
        async (req: Request, res: Response) => {

            const student = await userService.createStudent(
                req.user!.schoolId!,
                req.body
            );

            res.status(201).json({
                success: true,
                message: "Student created successfully.",
                data: student,
            });

        }
    );

    getStudents = catchAsync(
        async (req: Request, res: Response) => {

            const students = await userService.getStudents(
                req.user!.schoolId!,
                req.query as any
            );

            res.status(200).json({
                success: true,
                message: "Students fetched successfully.",
                data: students,
            });

        }
    );

    getStudent = catchAsync(
        async (req: Request, res: Response) => {

            const student = await userService.getStudent(
                req.user!.schoolId!,
                req.params.id
            );

            res.status(200).json({
                success: true,
                message: "Student fetched successfully.",
                data: student,
            });

        }
    );

    updateStudent = catchAsync(
        async (req: Request, res: Response) => {

            const student = await userService.updateStudent(
                req.user!.schoolId!,
                req.params.id,
                req.body
            );

            res.status(200).json({
                success: true,
                message: "Student updated successfully.",
                data: student,
            });

        }
    );

    deleteStudent = catchAsync(
        async (req: Request, res: Response) => {

            const result = await userService.deleteStudent(
                req.user!.schoolId!,
                req.params.id
            );

            res.status(200).json({
                success: true,
                message: result.message,
            });

        }
    );

}

export default new UserController();