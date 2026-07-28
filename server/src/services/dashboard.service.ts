import { CourseStatus, UserRole, UserStatus } from "@prisma/client";

import { prisma } from "../config/db";

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

}

export default new DashboardService();