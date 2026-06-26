import { Request, Response, NextFunction } from "express";
import { UserRole } from "@prisma/client";
import ApiError from "../config/ApiError";

export const authorize = (...roles: UserRole[]) => (req: Request, _: Response, next: NextFunction) => {

    if (!req.user) {
        return next(
            new ApiError(401, "Unauthorized")
        );
    };

    if (!roles.includes(req.user.role)) {
        return next(
            new ApiError(
                403,
                "Forbidden: You do not have permission to access this resource."
            )
        );
    };

    next();
}