import { prisma } from "../config/db";
import ApiError from "../config/ApiError";
import { UserRole, UserStatus } from "@prisma/client";
import { hashPassword } from "../config/password";

class SchoolAdminService {
  // 1. Dashboard Statistics
  async getDashboardStats(schoolId: string) {
    const studentCount = await prisma.student.count({ where: { schoolId } });
    const teacherCount = await prisma.teacher.count({ where: { schoolId } });
    const bookCount = await prisma.book.count({ where: { schoolId } });
    const busCount = await prisma.bus.count({ where: { schoolId } });

    // Calculate Attendance Percentage for the Current Month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const attendances = await prisma.studentAttendance.findMany({
      where: {
        student: { schoolId },
        date: { gte: startOfMonth },
      },
    });

    const totalAttendanceCount = attendances.length;
    const presentCount = attendances.filter((a) => a.status === "PRESENT" || a.status === "LATE").length;
    const attendancePercentage = totalAttendanceCount > 0 ? Math.round((presentCount / totalAttendanceCount) * 100) : 100;

    // Calculate Fee Collection Stats
    const studentFees = await prisma.studentFee.findMany({
      where: { student: { schoolId } },
      select: {
        totalAmount: true,
        paidAmount: true,
        dueAmount: true,
      },
    });

    let totalInvoiced = 0;
    let totalCollected = 0;
    let totalPending = 0;

    studentFees.forEach((fee) => {
      totalInvoiced += Number(fee.totalAmount);
      totalCollected += Number(fee.paidAmount);
      totalPending += Number(fee.dueAmount);
    });

    // Recent events list
    const recentActivities = [
      { id: "1", text: "Registered 15 new students via CSV bulk import", timestamp: "5 mins ago" },
      { id: "2", text: "Attendance marked for Grade 3 - Section A", timestamp: "1 hour ago" },
      { id: "3", text: "Recorded tuition fee payment for roll no 104", timestamp: "2 hours ago" },
    ];

    return {
      counters: {
        students: studentCount,
        teachers: teacherCount,
        books: bookCount,
        buses: busCount,
      },
      attendance: {
        percentage: attendancePercentage,
        totalLogs: totalAttendanceCount,
      },
      fees: {
        invoiced: totalInvoiced,
        collected: totalCollected,
        pending: totalPending,
      },
      activities: recentActivities,
    };
  }

  // 2. Setup (Academic Years, Classes & Sections)
  async createAcademicYear(schoolId: string, data: any) {
    if (data.isCurrent) {
      // Set others to false
      await prisma.academicYear.updateMany({
        where: { schoolId },
        data: { isCurrent: false },
      });
    }

    return prisma.academicYear.create({
      data: {
        schoolId,
        name: data.name,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        isCurrent: !!data.isCurrent,
      },
    });
  }

  async getAcademicYears(schoolId: string) {
    return prisma.academicYear.findMany({
      where: { schoolId },
      orderBy: { startDate: "desc" },
    });
  }

  async createClass(schoolId: string, data: any) {
    return prisma.class.create({
      data: {
        schoolId,
        academicYearId: data.academicYearId,
        name: data.name,
        description: data.description,
      },
    });
  }

  async getClasses(schoolId: string) {
    return prisma.class.findMany({
      where: { schoolId },
      include: {
        sections: true,
      },
      orderBy: { name: "asc" },
    });
  }

  async createSection(classId: string, data: any) {
    return prisma.section.create({
      data: {
        classId,
        name: data.name,
      },
    });
  }

  async getSections(classId: string) {
    return prisma.section.findMany({
      where: { classId },
      orderBy: { name: "asc" },
    });
  }

  // 3. Subject Management
  async createSubject(schoolId: string, data: any) {
    return prisma.subject.create({
      data: {
        schoolId,
        name: data.name,
        code: data.code,
        description: data.description,
      },
    });
  }

  async getSubjects(schoolId: string) {
    return prisma.subject.findMany({
      where: { schoolId },
      orderBy: { name: "asc" },
    });
  }

  // 4. Student Management
  async registerStudent(schoolId: string, data: any) {
    const hashedPassword = await hashPassword(data.password || "student123");

    return prisma.$transaction(async (tx) => {
      // Find or create parent
      let parent = await tx.parent.findFirst({
        where: { phone: data.parentPhone, schoolId },
      });

      if (!parent) {
        const parentHashedPassword = await hashPassword("parent123");
        const parentUser = await tx.user.create({
          data: {
            schoolId,
            firstName: data.parentFatherName || "Parent",
            lastName: data.lastName,
            email: data.parentEmail || `parent_${Date.now()}@eduverse.io`,
            password: parentHashedPassword,
            phone: data.parentPhone,
            role: UserRole.PARENT,
          },
        });

        parent = await tx.parent.create({
          data: {
            userId: parentUser.id,
            schoolId,
            fatherName: data.parentFatherName || "Father Name",
            motherName: data.parentMotherName || "Mother Name",
            phone: data.parentPhone,
            email: data.parentEmail,
            address: data.address,
          },
        });
      }

      // Create student user login account
      const studentUser = await tx.user.create({
        data: {
          schoolId,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email || `stud_${Date.now()}@eduverse.io`,
          password: hashedPassword,
          phone: data.phone,
          role: UserRole.STUDENT,
        },
      });

      // Create student profile
      const admissionNum = data.admissionNumber || `ADM-${Date.now()}`;
      const student = await tx.student.create({
        data: {
          userId: studentUser.id,
          parentId: parent.id,
          schoolId,
          classId: data.classId,
          sectionId: data.sectionId,
          admissionNumber: admissionNum,
          rollNumber: data.rollNumber,
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender,
          dob: data.dob ? new Date(data.dob) : null,
          photoUrl: data.photoUrl,
          admissionDate: data.admissionDate ? new Date(data.admissionDate) : new Date(),
        },
      });

      return student;
    });
  }

  async getStudents(schoolId: string, filters: { classId?: string; sectionId?: string }) {
    const whereClause: any = { schoolId };
    if (filters.classId) whereClause.classId = filters.classId;
    if (filters.sectionId) whereClause.sectionId = filters.sectionId;

    return prisma.student.findMany({
      where: whereClause,
      include: {
        class: true,
        section: true,
        parent: true,
      },
      orderBy: { rollNumber: "asc" },
    });
  }

  async bulkImportStudents(schoolId: string, studentsList: any[]) {
    const importResults = [];
    for (const studentData of studentsList) {
      try {
        const student = await this.registerStudent(schoolId, studentData);
        importResults.push(student);
      } catch (err) {
        console.error("Bulk Import Row Fail:", err);
      }
    }
    return importResults;
  }

  // 5. Teacher Management
  async registerTeacher(schoolId: string, data: any) {
    const hashedPassword = await hashPassword(data.password || "teacher123");

    return prisma.$transaction(async (tx) => {
      // Create user login account
      const user = await tx.user.create({
        data: {
          schoolId,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: hashedPassword,
          phone: data.phone,
          role: UserRole.TEACHER,
        },
      });

      // Create teacher profile
      const teacherCode = data.employeeCode || `EMP-${Date.now()}`;
      const teacher = await tx.teacher.create({
        data: {
          userId: user.id,
          schoolId,
          employeeCode: teacherCode,
          firstName: data.firstName,
          lastName: data.lastName,
          designation: data.designation,
          qualification: data.qualification,
          phone: data.phone,
          salary: data.salary ? Number(data.salary) : null,
          joiningDate: data.joiningDate ? new Date(data.joiningDate) : new Date(),
        },
      });

      // Map subjects if provided
      if (data.subjectIds && Array.isArray(data.subjectIds)) {
        for (const subId of data.subjectIds) {
          await tx.teacherSubject.create({
            data: {
              teacherId: teacher.id,
              subjectId: subId,
            },
          });
        }
      }

      return teacher;
    });
  }

  async getTeachers(schoolId: string) {
    return prisma.teacher.findMany({
      where: { schoolId },
      include: {
        teacherSubjects: {
          include: {
            subject: true,
          },
        },
      },
      orderBy: { firstName: "asc" },
    });
  }

  async assignSubjectsToTeacher(teacherId: string, subjectIds: string[]) {
    return prisma.$transaction(async (tx) => {
      // Clear current subjects
      await tx.teacherSubject.deleteMany({
        where: { teacherId },
      });

      // Assign new subjects
      const assignments = [];
      for (const subId of subjectIds) {
        const item = await tx.teacherSubject.create({
          data: { teacherId, subjectId: subId },
        });
        assignments.push(item);
      }
      return assignments;
    });
  }

  // 6. Attendance Management
  async markAttendance(schoolId: string, markedById: string, dateStr: string, attendances: any[]) {
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);

    const savedRecords = [];
    for (const record of attendances) {
      const { studentId, status } = record; // status: PRESENT, ABSENT, LATE, HALF_DAY

      // Upsert record
      const attendance = await prisma.studentAttendance.upsert({
        where: {
          studentId_date: { studentId, date },
        },
        update: {
          status,
          markedById,
        },
        create: {
          studentId,
          date,
          status,
          markedById,
        },
      });

      // Log alerts for absentees to console (mock parent SMS/Email alert)
      if (status === "ABSENT") {
        const student = await prisma.student.findUnique({
          where: { id: studentId },
          include: { parent: true },
        });
        if (student) {
          console.log(
            `[SMS/EMAIL ALERT SENT] To Parent of ${student.firstName}: "Dear Parent, your child ${student.firstName} ${student.lastName} was marked ABSENT today (${dateStr})."`
          );
        }
      }

      savedRecords.push(attendance);
    }

    return savedRecords;
  }

  async getAttendance(schoolId: string, classId: string, sectionId: string, dateStr: string) {
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);

    // Get students in class/section
    const students = await prisma.student.findMany({
      where: { schoolId, classId, sectionId },
      orderBy: { rollNumber: "asc" },
    });

    // Get marked attendances
    const markedLogs = await prisma.studentAttendance.findMany({
      where: {
        student: { schoolId, classId, sectionId },
        date,
      },
    });

    return students.map((student) => {
      const logged = markedLogs.find((l) => l.studentId === student.id);
      return {
        studentId: student.id,
        rollNumber: student.rollNumber,
        firstName: student.firstName,
        lastName: student.lastName,
        status: logged ? logged.status : "PRESENT", // Default to present
      };
    });
  }

  // 7. Fee Management
  async createFeeStructure(schoolId: string, data: any) {
    return prisma.feeStructure.create({
      data: {
        schoolId,
        classId: data.classId,
        tuitionFee: Number(data.tuitionFee),
        transportFee: Number(data.transportFee),
        examFee: Number(data.examFee),
        libraryFee: Number(data.libraryFee),
        miscFee: Number(data.miscFee),
      },
    });
  }

  async getFeeStructures(schoolId: string) {
    return prisma.feeStructure.findMany({
      where: { schoolId },
      include: {
        class: true,
      },
    });
  }

  async getStudentFees(schoolId: string, classId?: string) {
    const whereClause: any = { student: { schoolId } };
    if (classId) whereClause.student.classId = classId;

    return prisma.studentFee.findMany({
      where: whereClause,
      include: {
        student: {
          include: {
            class: true,
            section: true,
          },
        },
        feeStructure: true,
        payments: true,
      },
      orderBy: { student: { rollNumber: "asc" } },
    });
  }

  async allocateFeeToStudent(studentId: string, feeStructureId: string, dueDateStr: string) {
    const feeStructure = await prisma.feeStructure.findUnique({
      where: { id: feeStructureId },
    });

    if (!feeStructure) {
      throw new ApiError(404, "Fee structure not found");
    }

    const total =
      Number(feeStructure.tuitionFee) +
      Number(feeStructure.transportFee) +
      Number(feeStructure.examFee) +
      Number(feeStructure.libraryFee) +
      Number(feeStructure.miscFee);

    return prisma.studentFee.create({
      data: {
        studentId,
        feeStructureId,
        totalAmount: total,
        paidAmount: 0,
        dueAmount: total,
        dueDate: new Date(dueDateStr),
        status: "PENDING",
      },
    });
  }

  async recordFeePayment(studentFeeId: string, amount: number, paymentMethod: string) {
    return prisma.$transaction(async (tx) => {
      const studentFee = await tx.studentFee.findUnique({
        where: { id: studentFeeId },
      });

      if (!studentFee) {
        throw new ApiError(404, "Student fee record not found");
      }

      const currentPaid = Number(studentFee.paidAmount) + amount;
      const currentDue = Number(studentFee.totalAmount) - currentPaid;
      const newStatus = currentDue <= 0 ? "PAID" : currentPaid > 0 ? "PARTIAL" : "PENDING";

      // Create Payment log
      const payment = await tx.payment.create({
        data: {
          studentFeeId,
          amount,
          paymentMethod,
          status: "SUCCESS",
        },
      });

      // Update StudentFee balance
      await tx.studentFee.update({
        where: { id: studentFeeId },
        data: {
          paidAmount: currentPaid,
          dueAmount: currentDue < 0 ? 0 : currentDue,
          status: newStatus,
        },
      });

      return payment;
    });
  }

  // 8. Library Management
  async createBook(schoolId: string, data: any) {
    return prisma.book.create({
      data: {
        schoolId,
        title: data.title,
        author: data.author,
        isbn: data.isbn,
        quantity: Number(data.quantity),
        availableQuantity: Number(data.quantity),
      },
    });
  }

  async getBooks(schoolId: string) {
    return prisma.book.findMany({
      where: { schoolId },
      orderBy: { title: "asc" },
    });
  }

  async issueBook(studentId: string, bookId: string, dueDateStr: string) {
    return prisma.$transaction(async (tx) => {
      const book = await tx.book.findUnique({ where: { id: bookId } });
      if (!book || book.availableQuantity <= 0) {
        throw new ApiError(400, "Book is not available for issue.");
      }

      // Decrement availability
      await tx.book.update({
        where: { id: bookId },
        data: { availableQuantity: book.availableQuantity - 1 },
      });

      return tx.bookIssue.create({
        data: {
          studentId,
          bookId,
          issueDate: new Date(),
          dueDate: new Date(dueDateStr),
        },
      });
    });
  }

  async returnBook(bookIssueId: string, fineAmount: number) {
    return prisma.$transaction(async (tx) => {
      const issue = await tx.bookIssue.findUnique({
        where: { id: bookIssueId },
      });

      if (!issue) {
        throw new ApiError(404, "Issue record not found");
      }

      if (issue.returnDate) {
        throw new ApiError(400, "Book already returned");
      }

      // Increment availability
      await tx.book.update({
        where: { id: issue.bookId },
        data: { availableQuantity: { increment: 1 } },
      });

      return tx.bookIssue.update({
        where: { id: bookIssueId },
        data: {
          returnDate: new Date(),
          fineAmount: Number(fineAmount),
        },
      });
    });
  }

  async getLibraryIssues(schoolId: string) {
    return prisma.bookIssue.findMany({
      where: {
        student: { schoolId },
      },
      include: {
        student: true,
        book: true,
      },
      orderBy: { issueDate: "desc" },
    });
  }

  // 9. Bus & Transportation Management
  async createBus(schoolId: string, data: any) {
    return prisma.bus.create({
      data: {
        schoolId,
        busNumber: data.busNumber,
        driverName: data.driverName,
        driverPhone: data.driverPhone,
      },
    });
  }

  async getBuses(schoolId: string) {
    return prisma.bus.findMany({
      where: { schoolId },
    });
  }

  async createRoute(schoolId: string, data: any) {
    return prisma.route.create({
      data: {
        schoolId,
        busId: data.busId || null,
        name: data.name,
      },
    });
  }

  async getRoutes(schoolId: string) {
    return prisma.route.findMany({
      where: { schoolId },
      include: {
        bus: true,
        stops: true,
      },
    });
  }

  async createStop(routeId: string, data: any) {
    return prisma.stop.create({
      data: {
        routeId,
        stopName: data.stopName,
        latitude: data.latitude ? Number(data.latitude) : null,
        longitude: data.longitude ? Number(data.longitude) : null,
      },
    });
  }

  async allocateTransport(studentId: string, routeId: string, stopId: string) {
    return prisma.studentTransport.upsert({
      where: { studentId },
      update: { routeId, stopId },
      create: { studentId, routeId, stopId },
    });
  }

  async getTransportAllocations(schoolId: string) {
    return prisma.studentTransport.findMany({
      where: {
        student: { schoolId },
      },
      include: {
        student: {
          include: {
            class: true,
            section: true,
          },
        },
        route: true,
        stop: true,
      },
    });
  }
}

export default new SchoolAdminService();
