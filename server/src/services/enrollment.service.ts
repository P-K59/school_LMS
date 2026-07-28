import ApiError from "../config/ApiError";
import { prisma } from "../config/db";

class EnrollmentService {

    // Enroll Student
    async enroll(userId: string, courseId: string) {

        const course = await prisma.course.findUnique({
            where: {
                id: courseId,
            },
        });

        if (!course) {
            throw new ApiError(404, "Course not found.");
        }

        const alreadyEnrolled = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
        });

        if (alreadyEnrolled) {
            throw new ApiError(409, "Already enrolled in this course.");
        }

        return prisma.enrollment.create({
            data: {
                userId,
                courseId,
            },
            include: {
                course: {
                    include: {
                        modules: {
                            include: {
                                lessons: true,
                            },
                        },
                    },
                },
            },
        });
    }

    // Student Courses
    async getMyCourses(userId: string) {

        return prisma.enrollment.findMany({
            where: {
                userId,
            },
            include: {
                course: {
                    include: {
                        modules: {
                            include: {
                                lessons: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                enrolledAt: "desc",
            },
        });
    }

    // Course Students
    async getCourseStudents(courseId: string) {

        return prisma.enrollment.findMany({
            where: {
                courseId,
            },
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
        });
    }

    // Update Progress
    async updateProgress(
        userId: string,
        courseId: string,
        progress: number
    ) {

        const enrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
        });

        if (!enrollment) {
            throw new ApiError(404, "Enrollment not found.");
        }

        return prisma.enrollment.update({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
            data: {
                progress,
                completed: progress >= 100,
            },
        });
    }

    // Remove Enrollment
    async unenroll(
        userId: string,
        courseId: string
    ) {

        const enrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
        });

        if (!enrollment) {
            throw new ApiError(404, "Enrollment not found.");
        }

        await prisma.enrollment.delete({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
        });

        return {
            success: true,
            message: "Enrollment removed successfully.",
        };
    }
}

export default new EnrollmentService();