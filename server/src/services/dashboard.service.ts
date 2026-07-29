import { CourseStatus, UserRole, UserStatus } from "@prisma/client";

import { prisma } from "../config/db";
import ApiError from "../config/ApiError";

class DashboardService {

    async getAdminDashboard(schoolId: string) {

        const [
            statistics,
            recentStudents,
            recentCourses,
            latestEnrollments,
            topCourses,
            recentLogins,
            studentRegistrationGraph,
            enrollmentGraph,
        ] = await Promise.all([

            this.getStatistics(schoolId),

            this.getRecentStudents(schoolId),

            this.getRecentCourses(schoolId),

            this.getLatestEnrollments(schoolId),

            this.getTopCourses(schoolId),

            this.getRecentLogins(schoolId),

            this.getStudentRegistrationGraph(schoolId),

            this.getEnrollmentGraph(schoolId),

        ]);

        return {
            statistics,
            recentStudents,
            recentCourses,
            latestEnrollments,
            topCourses,
            recentLogins,
            studentRegistrationGraph,
            enrollmentGraph,
        };
    }

    private async getStatistics(schoolId: string) {

        const [
            totalStudents,
            activeStudents,
            inactiveStudents,
            totalCourses,
            publishedCourses,
            draftCourses,
            totalEnrollments,
        ] = await prisma.$transaction([

            prisma.user.count({
                where: {
                    schoolId,
                    role: UserRole.STUDENT,
                },
            }),

            prisma.user.count({
                where: {
                    schoolId,
                    role: UserRole.STUDENT,
                    status: UserStatus.ACTIVE,
                },
            }),

            prisma.user.count({
                where: {
                    schoolId,
                    role: UserRole.STUDENT,
                    status: UserStatus.INACTIVE,
                },
            }),

            prisma.course.count({
                where: {
                    schoolId,
                },
            }),

            prisma.course.count({
                where: {
                    schoolId,
                    status: CourseStatus.PUBLISHED,
                },
            }),

            prisma.course.count({
                where: {
                    schoolId,
                    status: CourseStatus.DRAFT,
                },
            }),

            prisma.enrollment.count({
                where: {
                    course: {
                        schoolId,
                    },
                },
            }),

        ]);

        return {
            totalStudents,
            activeStudents,
            inactiveStudents,
            totalCourses,
            publishedCourses,
            draftCourses,
            totalEnrollments,
        };
    }

    private async getRecentStudents(
        schoolId: string,
        limit: number = 5
    ) {

        return await prisma.user.findMany({
            where: {
                schoolId,
                role: UserRole.STUDENT,
            },

            orderBy: {
                createdAt: "desc",
            },

            take: limit,

            select: {
                id: true,
                studentId: true,
                firstName: true,
                lastName: true,
                email: true,
                avatar: true,
                phone: true,
                status: true,
                lastLogin: true,
                createdAt: true,
            },
        });

    }

    private async getRecentCourses(
        schoolId: string,
        limit: number = 5
    ) {

        const courses = await prisma.course.findMany({
            where: {
                schoolId,
            },

            orderBy: {
                createdAt: "desc",
            },

            take: limit,

            include: {

                createdBy: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },

                _count: {
                    select: {
                        enrollments: true,
                        modules: true,
                    },
                },

            },

        });

        return courses.map((course) => ({
            id: course.id,
            title: course.title,
            description: course.description,
            thumbnail: course.thumbnail,
            status: course.status,

            createdBy: {
                id: course.createdBy.id,
                name: `${course.createdBy.firstName} ${course.createdBy.lastName}`,
            },

            totalEnrollments: course._count.enrollments,
            totalModules: course._count.modules,

            createdAt: course.createdAt,
        }));

    }

    private async getLatestEnrollments(
        schoolId: string,
        limit: number = 5
    ) {

        const enrollments = await prisma.enrollment.findMany({
            where: {
                course: {
                    schoolId,
                },
            },

            orderBy: {
                enrolledAt: "desc",
            },

            take: limit,

            include: {
                user: {
                    select: {
                        id: true,
                        studentId: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },

                course: {
                    select: {
                        id: true,
                        title: true,
                        thumbnail: true,
                    },
                },
            },
        });

        return enrollments.map((enrollment) => ({
            id: enrollment.id,

            enrolledAt: enrollment.enrolledAt,

            progress: enrollment.progress,

            completed: enrollment.completed,

            student: {
                id: enrollment.user.id,
                studentId: enrollment.user.studentId,
                name: `${enrollment.user.firstName} ${enrollment.user.lastName}`,
                avatar: enrollment.user.avatar,
            },

            course: {
                id: enrollment.course.id,
                title: enrollment.course.title,
                thumbnail: enrollment.course.thumbnail,
            },
        }));
    }

    private async getTopCourses(
        schoolId: string,
        limit: number = 5
    ) {

        const courses = await prisma.course.findMany({
            where: {
                schoolId,
            },

            include: {
                _count: {
                    select: {
                        enrollments: true,
                        modules: true,
                    },
                },

                createdBy: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        return courses
            .sort(
                (a, b) =>
                    b._count.enrollments -
                    a._count.enrollments
            )
            .slice(0, limit)
            .map((course) => ({

                id: course.id,

                title: course.title,

                thumbnail: course.thumbnail,

                status: course.status,

                price: course.price,

                totalEnrollments:
                    course._count.enrollments,

                totalModules:
                    course._count.modules,

                createdBy: `${course.createdBy.firstName} ${course.createdBy.lastName}`,

            }));
    }

    private async getRecentLogins(
        schoolId: string,
        limit: number = 5
    ) {

        return await prisma.user.findMany({
            where: {
                schoolId,
                role: UserRole.STUDENT,
                status: UserStatus.ACTIVE,
                lastLogin: {
                    not: null,
                },
            },

            orderBy: {
                lastLogin: "desc",
            },

            take: limit,

            select: {
                id: true,
                studentId: true,
                firstName: true,
                lastName: true,
                avatar: true,
                email: true,
                lastLogin: true,
            },
        });

    }

    async getStudentDashboard(userId: string) {

        const [
            profile,
            statistics,
            enrolledCourses,
            continueLearning,
        ] = await Promise.all([

            this.getStudentProfile(userId),

            this.getStudentStatistics(userId),

            this.getEnrolledCourses(userId),

            this.getContinueLearning(userId),

        ]);

        return {
            profile,
            statistics,
            continueLearning,
            enrolledCourses,
        };

    }

    private async getStudentProfile(userId: string) {

        const student = await prisma.user.findUnique({
            where: {
                id: userId,
            },

            select: {
                id: true,
                studentId: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                avatar: true,
                createdAt: true,
                school: {
                    select: {
                        id: true,
                        name: true,
                        logo: true,
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

        return {
            ...student,
            fullName: `${student.firstName} ${student.lastName}`,
        };

    }

    private async getStudentStatistics(
        userId: string
    ) {

        const [
            totalEnrollments,
            completedCourses,
            inProgressCourses,
            enrollments,
        ] = await prisma.$transaction([

            prisma.enrollment.count({
                where: {
                    userId,
                },
            }),

            prisma.enrollment.count({
                where: {
                    userId,
                    completed: true,
                },
            }),

            prisma.enrollment.count({
                where: {
                    userId,
                    completed: false,
                },
            }),

            prisma.enrollment.findMany({
                where: {
                    userId,
                },
                select: {
                    progress: true,
                },
            }),

        ]);

        const overallProgress =
            enrollments.length === 0
                ? 0
                : Number(
                    (
                        enrollments.reduce(
                            (sum, enrollment) =>
                                sum + enrollment.progress,
                            0
                        ) / enrollments.length
                    ).toFixed(2)
                );

        return {

            enrolledCourses: totalEnrollments,

            completedCourses,

            inProgressCourses,

            overallProgress,

        };

    }

    private async getEnrolledCourses(
        userId: string
    ) {

        const enrollments = await prisma.enrollment.findMany({
            where: {
                userId,
            },

            include: {
                course: {
                    include: {
                        createdBy: {
                            select: {
                                firstName: true,
                                lastName: true,
                            },
                        },

                        _count: {
                            select: {
                                modules: true,
                            },
                        },
                    },
                },
            },

            orderBy: {
                enrolledAt: "desc",
            },
        });

        return enrollments.map((enrollment) => ({

            id: enrollment.course.id,

            title: enrollment.course.title,

            description: enrollment.course.description,

            thumbnail: enrollment.course.thumbnail,

            status: enrollment.course.status,

            price: enrollment.course.price,

            progress: enrollment.progress,

            completed: enrollment.completed,

            enrolledAt: enrollment.enrolledAt,

            totalModules: enrollment.course._count.modules,

            instructor: `${enrollment.course.createdBy.firstName} ${enrollment.course.createdBy.lastName}`,

        }));

    }

    private async getContinueLearning(
        userId: string
    ) {

        const enrollment = await prisma.enrollment.findFirst({
            where: {
                userId,
                completed: false,
            },

            orderBy: {
                progress: "desc",
            },

            include: {
                course: {
                    include: {
                        createdBy: {
                            select: {
                                firstName: true,
                                lastName: true,
                            },
                        },

                        _count: {
                            select: {
                                modules: true,
                            },
                        },
                    },
                },
            },
        });

        if (!enrollment) {
            return null;
        }

        return {

            id: enrollment.course.id,

            title: enrollment.course.title,

            description: enrollment.course.description,

            thumbnail: enrollment.course.thumbnail,

            progress: enrollment.progress,

            totalModules: enrollment.course._count.modules,

            instructor: `${enrollment.course.createdBy.firstName} ${enrollment.course.createdBy.lastName}`,

            enrolledAt: enrollment.enrolledAt,

        };

    }

}

export default new DashboardService();