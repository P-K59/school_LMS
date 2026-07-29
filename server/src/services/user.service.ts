import { UserRole, UserStatus } from "@prisma/client";
import { randomBytes } from "crypto";

import ApiError from "../config/ApiError";
import { prisma } from "../config/db";
import { hashPassword } from "../config/password";

import {
    CreateStudentDto,
} from "../dto/user.dto";

class UserService {

    private async generateStudentId(
        schoolId: string
    ) {

        const count = await prisma.user.count({
            where: {
                schoolId,
                role: UserRole.STUDENT,
            },
        });

        const year = new Date().getFullYear();

        const serial = String(count + 1)
            .padStart(4, "0");

        return `STD${year}${serial}`;
    }

    private generateTemporaryPassword() {

        return randomBytes(4).toString("hex") + "@1";
    }

    async createStudent(
        schoolId: string,
        data: CreateStudentDto
    ) {

        // Check duplicate email
        const existingUser = await prisma.user.findUnique({
            where: {
                email: data.email,
            },
        });

        if (existingUser) {
            throw new ApiError(
                409,
                "Student with this email already exists."
            );
        }

        // Generate Student ID
        const studentId = await this.generateStudentId(
            schoolId
        );

        // Generate Temporary Password
        const temporaryPassword =
            this.generateTemporaryPassword();

        // Hash Password
        const hashedPassword =
            await hashPassword(
                temporaryPassword
            );

        // Create Student
        const student =
            await prisma.user.create({
                data: {
                    schoolId,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    phone: data.phone,

                    studentId,

                    password: hashedPassword,

                    role: UserRole.STUDENT,

                    status: UserStatus.ACTIVE,

                    mustChangePassword: true,
                },

                select: {
                    id: true,
                    studentId: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    phone: true,
                    role: true,
                    status: true,
                    createdAt: true,
                },
            });

        return {
            ...student,
            temporaryPassword,
        };
    }

    async getStudents(
        schoolId: string,
        query: {
            page?: number;
            limit?: number;
            search?: string;
        }
    ) {

        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;
        const skip = (page - 1) * limit;

        const search = query.search?.trim();

        const where = {
            schoolId,
            role: UserRole.STUDENT,

            ...(search && {
                OR: [
                    {
                        firstName: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        lastName: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        email: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        studentId: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                ],
            }),
        };

        const [students, total] = await prisma.$transaction([

            prisma.user.findMany({
                where,

                skip,

                take: limit,

                orderBy: {
                    createdAt: "desc",
                },

                select: {
                    id: true,
                    studentId: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    phone: true,
                    status: true,
                    lastLogin: true,
                    createdAt: true,
                },
            }),

            prisma.user.count({
                where,
            }),
        ]);

        return {
            students,

            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async getStudent(
        schoolId: string,
        studentId: string
    ) {

        const student = await prisma.user.findFirst({
            where: {
                id: studentId,
                schoolId,
                role: UserRole.STUDENT,
            },

            include: {
                enrollments: {
                    include: {
                        course: {
                            select: {
                                id: true,
                                title: true,
                                description: true,
                                thumbnail: true,
                                status: true,
                            },
                        },
                    },
                },
            },
        });

        if (!student) {
            throw new ApiError(
                404,
                "Student not found."
            );
        }

        const { password, ...studentWithoutPassword } = student;

        return studentWithoutPassword;
    }

    async updateStudent(
        schoolId: string,
        studentId: string,
        data: UpdateStudentDto
    ) {

        const student = await prisma.user.findFirst({
            where: {
                id: studentId,
                schoolId,
                role: UserRole.STUDENT,
            },
        });

        if (!student) {
            throw new ApiError(
                404,
                "Student not found."
            );
        }

        if (
            data.email &&
            data.email !== student.email
        ) {

            const existingUser =
                await prisma.user.findUnique({
                    where: {
                        email: data.email,
                    },
                });

            if (existingUser) {
                throw new ApiError(
                    409,
                    "Email is already in use."
                );
            }
        }

        const updatedStudent =
            await prisma.user.update({
                where: {
                    id: student.id,
                },

                data: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    phone: data.phone,
                    status: data.status,
                },

                select: {
                    id: true,
                    studentId: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    phone: true,
                    status: true,
                    updatedAt: true,
                },
            });

        return updatedStudent;
    }

    async deleteStudent(
        schoolId: string,
        studentId: string
    ) {

        const student = await prisma.user.findFirst({
            where: {
                id: studentId,
                schoolId,
                role: UserRole.STUDENT,
            },
        });

        if (!student) {
            throw new ApiError(
                404,
                "Student not found."
            );
        }

        if (student.status === UserStatus.INACTIVE) {
            throw new ApiError(
                400,
                "Student is already inactive."
            );
        }

        await prisma.user.update({
            where: {
                id: student.id,
            },
            data: {
                status: UserStatus.INACTIVE,
            },
        });

        return {
            message: "Student deleted successfully.",
        };
    }

}

export default new UserService();