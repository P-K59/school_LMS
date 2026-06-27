import { RequestHandler } from "express";
import catchAsync from "../config/catchAsync";
import authService from "../services/auth.service";
import { setRefreshTokenCookie } from "../utils/cookies";
import ApiResponse from "../config/ApiResponse";

//@desc Register School
//@route POST /api/v1/auth/register-school
export const registerSchool: RequestHandler = catchAsync(async (req, res) => {

    const result = await authService.registerSchool(req.body);

    setRefreshTokenCookie(res, result.refreshToken);

    return res.status(201).json(
        new ApiResponse(
            201,
            "school registered successfully.",
            {
                school: result.school,
                user: result.user,
                accessToken: result.accessToken
            }
        )
    );
});

//@desc Login
//@route POST /api/v1/auth/login
export const login: RequestHandler = catchAsync(async (req, res) => {

    const result = await authService.login(req.body);

    setRefreshTokenCookie(res, result.refreshToken);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Login successfully.",
            {
                user: result.user,
                school: result.school,
                accessToken: result.accessToken
            }
        )
    );
});

export const getCurrentUser:RequestHandler = catchAsync(async(req,res)=>{

    const result = await authService.getCurrentUser(req.user!.id);

    return res.status(200).json(
        new ApiResponse(
            200,
            "User fetched successfully.",
            result
        )
    );
});