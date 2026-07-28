import { RequestHandler } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

import { prisma } from "../config/db";
import ApiError from "../config/ApiError";
import catchAsync from "../config/catchAsync";
import { verifyAccessToken } from "../config/jwt";

export const authenticate: RequestHandler = catchAsync(async (req, _, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        throw new ApiError(401, "Authorization token is required.");
    }

    const token = authHeader.split(" ")[1];

    let decoded;

    try {
        decoded = verifyAccessToken(token);
    } catch (error) {

        if (error instanceof TokenExpiredError) {
            throw new ApiError(401, "Access token expired.");
        }

        if (error instanceof JsonWebTokenError) {
            throw new ApiError(401, "Invalid access token.");
        }

        throw error;
    }

    const user = await prisma.user.findUnique({
        where: {
            id: decoded.userId,
        },
        select: {
            id: true,
            schoolId: true,
            role: true,
            status: true,
        },
    });

    if (!user) {
        throw new ApiError(401, "User not found.");
    }

    if (user.status !== "ACTIVE") {
        throw new ApiError(403, "Account is inactive.");
    }

    req.user = {
        id: user.id,
        schoolId: user.schoolId,
        role: user.role,
    };

    next();
});