import ApiError from "../config/ApiError";
import { prisma } from "../config/db";

interface CreateModuleDto {
    title: string;
}

interface UpdateModuleDto {
    title?: string;
    order?: number;
}

class ModuleService {

    async createModule(courseId: string, data: CreateModuleDto) {

        const course = await prisma.course.findUnique({
            where: {
                id: courseId,
            },
        });

        if (!course) {
            throw new ApiError(404, "Course not found.");
        }

        const moduleCount = await prisma.module.count({
            where: {
                courseId,
            },
        });

        return prisma.module.create({
            data: {
                title: data.title,
                courseId,
                order: moduleCount + 1,
            },
        });
    }

    async getModules(courseId: string) {

        return prisma.module.findMany({
            where: {
                courseId,
            },
            include: {
                lessons: true,
            },
            orderBy: {
                order: "asc",
            },
        });
    }

    async getModule(id: string) {

        const module = await prisma.module.findUnique({
            where: {
                id,
            },
            include: {
                lessons: {
                    orderBy: {
                        order: "asc",
                    },
                },
                course: true,
            },
        });

        if (!module) {
            throw new ApiError(404, "Module not found.");
        }

        return module;
    }

    async updateModule(
        id: string,
        data: UpdateModuleDto
    ) {

        const exists = await prisma.module.findUnique({
            where: {
                id,
            },
        });

        if (!exists) {
            throw new ApiError(404, "Module not found.");
        }

        return prisma.module.update({
            where: {
                id,
            },
            data,
        });
    }

    async deleteModule(id: string) {

        const exists = await prisma.module.findUnique({
            where: {
                id,
            },
        });

        if (!exists) {
            throw new ApiError(404, "Module not found.");
        }

        await prisma.module.delete({
            where: {
                id,
            },
        });

        return {
            success: true,
            message: "Module deleted successfully.",
        };
    }

    async reorderModules(
        courseId: string,
        moduleIds: string[]
    ) {

        const modules = await prisma.module.findMany({
            where: {
                courseId,
            },
        });

        if (modules.length !== moduleIds.length) {
            throw new ApiError(400, "Invalid module order.");
        }

        await prisma.$transaction(
            moduleIds.map((id, index) =>
                prisma.module.update({
                    where: { id },
                    data: {
                        order: index + 1,
                    },
                })
            )
        );

        return {
            success: true,
            message: "Modules reordered successfully.",
        };
    }
}

export default new ModuleService();