import { RequestHandler } from "express";
import catchAsync from "../config/catchAsync";
import authService from "../services/auth.service";
import { clearRefreshTokenCookie, setRefreshTokenCookie } from "../utils/cookies";
import ApiResponse from "../config/ApiResponse";
import ApiError from "../config/ApiError";

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

//@desc Refresh Access Token
//@route POST /api/v1/auth/refresh
//@access Public
export const refreshToken: RequestHandler = catchAsync(async (req, res) => {
    const token = req.cookies.refreshToken;

    if (!token) {
        throw new ApiError(401, "Refresh token not found.");
    }

    const result = await authService.refreshToken(token);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Access token refreshed successfully.",
            result
        )
    );
});

//@desc Logout
//@route POST /api/v1/auth/logout
//@access Private
export const logout: RequestHandler = catchAsync(async (req, res) => {

    const token = req.cookies.refreshToken;

    if (token) {
        await authService.logout(token);
    }

    clearRefreshTokenCookie(res);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Logout successful."
        )
    );
});

//@desc Change Password
//@route PATCH /api/v1/auth/change-password
//@access Private
export const changePassword: RequestHandler = catchAsync(async (req, res) => {

    await authService.changePassword(
        req.user!.id,
        req.body.oldPassword,
        req.body.newPassword
    );

    clearRefreshTokenCookie(res);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Password changed successfully."
        )
    );
});