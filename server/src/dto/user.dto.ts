import { UserStatus } from "@prisma/client";

export interface ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}

export interface CreateStudentDto {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
}

export interface UpdateStudentDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    status?: "ACTIVE" | "INACTIVE";
}