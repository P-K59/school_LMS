import { RequestHandler } from "express";
import { prisma } from "../config/db";
import ApiError from "../config/ApiError";
import catchAsync from "../config/catchAsync";
import { verifyAccessToken } from "../config/jwt";

export const authenticate: RequestHandler = catchAsync(async (req, _, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        throw new ApiError(401, "Unauthorized");
    }

    const [, token] = authHeader.split(" ");

    const decoded = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
            id: true,
            schoolId: true,
            role: true,
            status: true,
        },
    });

    if (!user) {
        throw new ApiError(401, "User not found");
    }

    if (user.status !== "ACTIVE") {
        throw new ApiError(403, "Account is inactive");
    }

    req.user = {
        id: user.id,
        schoolId: user.schoolId,
        role: user.role,
    };

    next();
});