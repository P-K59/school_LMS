import { Response } from "express";
import { env } from "../config/env";

const isProduction = env.NODE_ENV === "production";

export const setRefreshTokenCookie = (res: Response, refreshToken:string): void => {
    res.cookie("refreshToken", refreshToken,{
        httpOnly:true,
        secure: isProduction,
        sameSite: isProduction? "none": "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
};

export const clearRefreshTokenCookie = (res: Response): void => {
    res.clearCookie("refreshToken",{
        httpOnly:true,
        secure: isProduction,
        sameSite: isProduction? "none": "lax",
    });
};
