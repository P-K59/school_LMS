import { Request, Response, NextFunction } from "express";
import ApiError from "../config/ApiError";
import { prisma } from "../config/db";

const mustChangePassword = async (
    req: Request,
    _res: Response,
    next: NextFunction
) => {

    if (!req.user) {
        throw new ApiError(401, "Unauthorized");
    }

    const user = await prisma.user.findUnique({
        where: {
            id: req.user.id,
        },
        select: {
            mustChangePassword: true,
            role: true,
        },
    });

    if (!user) {
        throw new ApiError(404, "User not found.");
    }

    if (
        user.role === "STUDENT" &&
        user.mustChangePassword
    ) {
        throw new ApiError(
            403,
            "Please change your password before continuing."
        );
    }

    next();
};

export default mustChangePassword;