import { CourseStatus } from "@prisma/client";
import ApiError from "../config/ApiError";
import { prisma } from "../config/db";
import { CreateCourseDto, UpdateCourseDto } from "../dto/course.dto";

class CourseService {

    async createCourse(data: CreateCourseDto, user: Express.Request["user"]) {

        const course = await prisma.course.create({
            data: {
                title: data.title,
                description: data.description,
                thumbnail: data.thumbnail,
                price: data.price ?? 0,
                schoolId: user!.schoolId!,
                createdById: user!.id,
            },
        });

        return course;
    }

    async getCourses(schoolId: string) {

        return await prisma.course.findMany({
            where: {
                schoolId,
            },
            include: {
                modules: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    async getCourse(id: string) {

        const course = await prisma.course.findUnique({
            where: { id },
            include: {
                modules: {
                    include: {
                        lessons: true,
                    },
                },
            },
        });

        if (!course)
            throw new ApiError(404, "Course not found.");

        return course;
    }

    async updateCourse(id: string, data: UpdateCourseDto) {

        const exists = await prisma.course.findUnique({
            where: { id },
        });

        if (!exists)
            throw new ApiError(404, "Course not found.");

        return await prisma.course.update({
            where: { id },
            data: {
                ...data,
                status: data.status as CourseStatus | undefined,
            },
        });
    }

    async deleteCourse(id: string) {

        const exists = await prisma.course.findUnique({
            where: { id },
        });

        if (!exists)
            throw new ApiError(404, "Course not found.");

        await prisma.course.delete({
            where: { id },
        });

        return;
    }

}

export default new CourseService();