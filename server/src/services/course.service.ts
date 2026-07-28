import { CourseStatus } from "@prisma/client";
import ApiError from "../config/ApiError";
import { prisma } from "../config/db";
import { CreateCourseDto, UpdateCourseDto } from "../dto/course.dto";

class CourseService {

    async createCourse(
        data: CreateCourseDto,
        user: Express.Request["user"]
    ) {

        const course = await prisma.course.create({
            data: {
                title: data.title,
                description: data.description,
                thumbnail: data.thumbnail,
                price: data.price ?? 0,
                schoolId: user!.schoolId!,
                createdById: user!.id,
            },
            include: {
                modules: true,
            },
        });

        return course;
    }

    async getCourses(schoolId: string) {

        return prisma.course.findMany({
            where: {
                schoolId,
            },
            include: {
                modules: {
                    include: {
                        lessons: true,
                    },
                },
                createdBy: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                _count: {
                    select: {
                        enrollments: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    async getCourse(id: string, schoolId?: string) {

        const course = await prisma.course.findFirst({
            where: {
                id,
                ...(schoolId && { schoolId }),
            },
            include: {
                modules: {
                    include: {
                        lessons: true,
                    },
                },
                createdBy: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                enrollments: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });

        if (!course) {
            throw new ApiError(404, "Course not found.");
        }

        return course;
    }

    async updateCourse(
        id: string,
        data: UpdateCourseDto,
        schoolId?: string
    ) {

        const exists = await prisma.course.findFirst({
            where: {
                id,
                ...(schoolId && { schoolId }),
            },
        });

        if (!exists) {
            throw new ApiError(404, "Course not found.");
        }

        return prisma.course.update({
            where: {
                id,
            },
            data: {
                ...data,
                status: data.status as CourseStatus | undefined,
            },
            include: {
                modules: {
                    include: {
                        lessons: true,
                    },
                },
            },
        });
    }

    async deleteCourse(
        id: string,
        schoolId?: string
    ) {

        const exists = await prisma.course.findFirst({
            where: {
                id,
                ...(schoolId && { schoolId }),
            },
        });

        if (!exists) {
            throw new ApiError(404, "Course not found.");
        }

        await prisma.course.delete({
            where: {
                id,
            },
        });

        return {
            success: true,
            message: "Course deleted successfully.",
        };
    }

    async publishCourse(id: string) {

        return prisma.course.update({
            where: {
                id,
            },
            data: {
                status: CourseStatus.PUBLISHED,
            },
        });
    }

    async archiveCourse(id: string) {

        return prisma.course.update({
            where: {
                id,
            },
            data: {
                status: CourseStatus.ARCHIVED,
            },
        });
    }
}

export default new CourseService();