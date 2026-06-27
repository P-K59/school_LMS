import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { UserRole } from "@prisma/client"
import { env } from "./env";

export interface JwtPayload {
    userId: string;
    schoolId: string | null;
    role: UserRole;
}

export const generateAccessToken = (payload: JwtPayload): string => {
    return jwt.sign(
        payload,
        env.JWT_ACCESS_SECRET as Secret,
        {
            expiresIn: env.JWT_ACCESS_EXPIRES,
        } as SignOptions
    );
};

export const generateRefreshToken = (payload: JwtPayload): string => {
    return jwt.sign(
        payload,
        env.JWT_REFRESH_SECRET as Secret,
        {
            expiresIn: env.JWT_REFRESH_EXPIRES,
        } as SignOptions
    );
};

export const verifyAccessToken = (token: string): JwtPayload => {
    return jwt.verify(token, env.JWT_ACCESS_SECRET as Secret) as JwtPayload;
}

export const verifyRefreshToken = (token: string): JwtPayload => {
    return jwt.verify(token, env.JWT_REFRESH_SECRET as Secret) as JwtPayload;
}