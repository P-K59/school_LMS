import ApiError from "../config/ApiError";
import { prisma } from "../config/db";
import uploadService from "./upload.service";

interface CreateLessonDto {
    title: string;
    description?: string;
    videoUrl?: string;
    pdfUrl?: string;
    duration?: number;
    isPreview?: boolean;
}

interface UpdateLessonDto {
    title?: string;
    description?: string;
    videoUrl?: string;
    pdfUrl?: string;
    duration?: number;
    isPreview?: boolean;
    order?: number;
}

class LessonService {

    async createLesson(moduleId: string, data: CreateLessonDto) {

        const module = await prisma.module.findUnique({
            where: {
                id: moduleId,
            },
        });

        if (!module) {
            throw new ApiError(404, "Module not found.");
        }

        const lessonCount = await prisma.lesson.count({
            where: {
                moduleId,
            },
        });

        return prisma.lesson.create({
            data: {
                title: data.title,
                description: data.description,
                videoUrl: data.videoUrl,
                pdfUrl: data.pdfUrl,
                duration: data.duration,
                isPreview: data.isPreview ?? false,
                order: lessonCount + 1,
                moduleId,
            },
        });
    }

    async getLessons(moduleId: string) {

        return prisma.lesson.findMany({
            where: {
                moduleId,
            },
            orderBy: {
                order: "asc",
            },
        });
    }

    async getLesson(id: string) {

        const lesson = await prisma.lesson.findUnique({
            where: {
                id,
            },
            include: {
                module: {
                    include: {
                        course: true,
                    },
                },
            },
        });

        if (!lesson) {
            throw new ApiError(404, "Lesson not found.");
        }

        return lesson;
    }

    async updateLesson(
        id: string,
        data: UpdateLessonDto
    ) {

        const lesson = await prisma.lesson.findUnique({
            where: {
                id,
            },
        });

        if (!lesson) {
            throw new ApiError(404, "Lesson not found.");
        }

        // Delete old video if a new one is provided
        if (
            data.videoUrl &&
            lesson.videoUrl &&
            data.videoUrl !== lesson.videoUrl
        ) {
            try {
                await uploadService.deleteFile(lesson.videoUrl);
            } catch (error) {
                console.warn("Failed to delete old video:", error);
            }
        }

        // Delete old PDF if a new one is provided
        if (
            data.pdfUrl &&
            lesson.pdfUrl &&
            data.pdfUrl !== lesson.pdfUrl
        ) {
            try {
                await uploadService.deleteFile(lesson.pdfUrl);
            } catch (error) {
                console.warn("Failed to delete old PDF:", error);
            }
        }

        return prisma.lesson.update({
            where: {
                id,
            },
            data,
        });
    }

    async deleteLesson(id: string) {

        const lesson = await prisma.lesson.findUnique({
            where: {
                id,
            },
        });

        if (!lesson) {
            throw new ApiError(404, "Lesson not found.");
        }

        // Delete associated video if it exists
        if (lesson.videoUrl) {
            try {
                await uploadService.deleteFile(lesson.videoUrl);
            } catch (error) {
                console.warn("Failed to delete video:", error);
            }
        }

        // Delete associated PDF if it exists
        if (lesson.pdfUrl) {
            try {
                await uploadService.deleteFile(lesson.pdfUrl);
            } catch (error) {
                console.warn("Failed to delete PDF:", error);
            }
        }

        await prisma.lesson.delete({
            where: {
                id,
            },
        });

        return {
            success: true,
            message: "Lesson deleted successfully.",
        };
    }

    async reorderLessons(
        moduleId: string,
        lessonIds: string[]
    ) {

        const module = await prisma.module.findUnique({
            where: {
                id: moduleId,
            },
        });

        if (!module) {
            throw new ApiError(404, "Module not found.");
        }

        const lessons = await prisma.lesson.findMany({
            where: {
                moduleId,
            },
            select: {
                id: true,
            },
        });

        if (lessons.length !== lessonIds.length) {
            throw new ApiError(
                400,
                "Lesson list does not match the module."
            );
        }

        const existingIds = new Set(
            lessons.map((lesson) => lesson.id)
        );

        const isValidOrder = lessonIds.every((id) =>
            existingIds.has(id)
        );

        if (!isValidOrder) {
            throw new ApiError(
                400,
                "Invalid lesson IDs provided."
            );
        }

        await prisma.$transaction(
            lessonIds.map((lessonId, index) =>
                prisma.lesson.update({
                    where: {
                        id: lessonId,
                    },
                    data: {
                        order: index + 1,
                    },
                })
            )
        );

        return {
            success: true,
            message: "Lessons reordered successfully.",
        };
    }
}

export default new LessonService();