import { prisma } from "../config/db";
import ApiError from "../config/ApiError";
import { CourseStatus } from "@prisma/client";

class AdminService {
  async getDashboard(schoolId: string) {
    const [users, courses, modules, lessons, enrollments] =
      await Promise.all([
        prisma.user.count({ where: { schoolId } }),
        prisma.course.count({ where: { schoolId } }),
        prisma.module.count({
          where: {
            course: { schoolId },
          },
        }),
        prisma.lesson.count({
          where: {
            module: {
              course: { schoolId },
            },
          },
        }),
        prisma.enrollment.count({
          where: {
            course: { schoolId },
          },
        }),
      ]);

    return {
      users,
      courses,
      modules,
      lessons,
      enrollments,
    };
  }

  async publishCourse(courseId: string) {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new ApiError(404, "Course not found.");
    }

    return prisma.course.update({
      where: { id: courseId },
      data: {
        status: CourseStatus.PUBLISHED,
      },
    });
  }

  async archiveCourse(courseId: string) {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new ApiError(404, "Course not found.");
    }

    return prisma.course.update({
      where: { id: courseId },
      data: {
        status: CourseStatus.ARCHIVED,
      },
    });
  }
}

export default new AdminService();