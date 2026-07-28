import { Request, Response } from "express";
import catchAsync from "../config/catchAsync";
import schoolAdminService from "../services/schoolAdmin.service";
import ApiResponse from "../config/ApiResponse";
import ApiError from "../config/ApiError";

// Helper to assert schoolId from user token
const getSchoolId = (req: Request): string => {
  const schoolId = req.user?.schoolId;
  if (!schoolId) {
    throw new ApiError(403, "Access denied. School profile scope not found.");
  }
  return schoolId;
};

// 1. Dashboard telemetry
export const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const schoolId = getSchoolId(req);
  const stats = await schoolAdminService.getDashboardStats(schoolId);
  return res.status(200).json(new ApiResponse(200, "Dashboard stats loaded.", stats));
});

// 2. Academic Year
export const createAcademicYear = catchAsync(async (req: Request, res: Response) => {
  const schoolId = getSchoolId(req);
  const result = await schoolAdminService.createAcademicYear(schoolId, req.body);
  return res.status(201).json(new ApiResponse(201, "Academic year created successfully.", result));
});

export const getAcademicYears = catchAsync(async (req: Request, res: Response) => {
  const schoolId = getSchoolId(req);
  const result = await schoolAdminService.getAcademicYears(schoolId);
  return res.status(200).json(new ApiResponse(200, "Academic years loaded.", result));
});

// 3. Class & Section
export const createClass = catchAsync(async (req: Request, res: Response) => {
  const schoolId = getSchoolId(req);
  const result = await schoolAdminService.createClass(schoolId, req.body);
  return res.status(201).json(new ApiResponse(201, "Class created successfully.", result));
});

export const getClasses = catchAsync(async (req: Request, res: Response) => {
  const schoolId = getSchoolId(req);
  const result = await schoolAdminService.getClasses(schoolId);
  return res.status(200).json(new ApiResponse(200, "Classes loaded.", result));
});

export const createSection = catchAsync(async (req: Request, res: Response) => {
  const { classId } = req.body;
  if (!classId) throw new ApiError(400, "classId is required");
  const result = await schoolAdminService.createSection(classId, req.body);
  return res.status(201).json(new ApiResponse(201, "Section created successfully.", result));
});

export const getSections = catchAsync(async (req: Request, res: Response) => {
  const { classId } = req.query;
  if (!classId) throw new ApiError(400, "classId query param is required");
  const result = await schoolAdminService.getSections(classId as string);
  return res.status(200).json(new ApiResponse(200, "Sections loaded.", result));
});

// 4. Subjects
export const createSubject = catchAsync(async (req: Request, res: Response) => {
  const schoolId = getSchoolId(req);
  const result = await schoolAdminService.createSubject(schoolId, req.body);
  return res.status(201).json(new ApiResponse(201, "Subject created successfully.", result));
});

export const getSubjects = catchAsync(async (req: Request, res: Response) => {
  const schoolId = getSchoolId(req);
  const result = await schoolAdminService.getSubjects(schoolId);
  return res.status(200).json(new ApiResponse(200, "Subjects loaded.", result));
});

// 5. Students
export const registerStudent = catchAsync(async (req: Request, res: Response) => {
  const schoolId = getSchoolId(req);
  const result = await schoolAdminService.registerStudent(schoolId, req.body);
  return res.status(201).json(new ApiResponse(201, "Student registered successfully.", result));
});

export const getStudents = catchAsync(async (req: Request, res: Response) => {
  const schoolId = getSchoolId(req);
  const { classId, sectionId } = req.query;
  const result = await schoolAdminService.getStudents(schoolId, {
    classId: classId ? (classId as string) : undefined,
    sectionId: sectionId ? (sectionId as string) : undefined,
  });
  return res.status(200).json(new ApiResponse(200, "Students loaded.", result));
});

export const bulkImportStudents = catchAsync(async (req: Request, res: Response) => {
  const schoolId = getSchoolId(req);
  const { students } = req.body;
  if (!students || !Array.isArray(students)) {
    throw new ApiError(400, "students array is required in request body");
  }
  const result = await schoolAdminService.bulkImportStudents(schoolId, students);
  return res.status(200).json(new ApiResponse(200, `Successfully imported ${result.length} students.`, result));
});

// 6. Teachers
export const registerTeacher = catchAsync(async (req: Request, res: Response) => {
  const schoolId = getSchoolId(req);
  const result = await schoolAdminService.registerTeacher(schoolId, req.body);
  return res.status(201).json(new ApiResponse(201, "Teacher registered successfully.", result));
});

export const getTeachers = catchAsync(async (req: Request, res: Response) => {
  const schoolId = getSchoolId(req);
  const result = await schoolAdminService.getTeachers(schoolId);
  return res.status(200).json(new ApiResponse(200, "Teachers loaded.", result));
});

export const assignSubjectsToTeacher = catchAsync(async (req: Request, res: Response) => {
  const { teacherId, subjectIds } = req.body;
  if (!teacherId || !subjectIds || !Array.isArray(subjectIds)) {
    throw new ApiError(400, "teacherId and subjectIds array are required");
  }
  const result = await schoolAdminService.assignSubjectsToTeacher(teacherId, subjectIds);
  return res.status(200).json(new ApiResponse(200, "Teacher subjects updated successfully.", result));
});

// 7. Attendance
export const markAttendance = catchAsync(async (req: Request, res: Response) => {
  const schoolId = getSchoolId(req);
  const markedById = req.user!.id;
  const { date, attendances } = req.body; // attendances: [{ studentId, status }]
  if (!date || !attendances || !Array.isArray(attendances)) {
    throw new ApiError(400, "date and attendances array are required");
  }
  const result = await schoolAdminService.markAttendance(schoolId, markedById, date, attendances);
  return res.status(200).json(new ApiResponse(200, "Attendance logs saved successfully.", result));
});

export const getAttendance = catchAsync(async (req: Request, res: Response) => {
  const schoolId = getSchoolId(req);
  const { classId, sectionId, date } = req.query;
  if (!classId || !sectionId || !date) {
    throw new ApiError(400, "classId, sectionId, and date query parameters are required");
  }
  const result = await schoolAdminService.getAttendance(schoolId, classId as string, sectionId as string, date as string);
  return res.status(200).json(new ApiResponse(200, "Attendance logs retrieved.", result));
});

// 8. Fees
export const createFeeStructure = catchAsync(async (req: Request, res: Response) => {
  const schoolId = getSchoolId(req);
  const result = await schoolAdminService.createFeeStructure(schoolId, req.body);
  return res.status(201).json(new ApiResponse(201, "Fee structure created successfully.", result));
});

export const getFeeStructures = catchAsync(async (req: Request, res: Response) => {
  const schoolId = getSchoolId(req);
  const result = await schoolAdminService.getFeeStructures(schoolId);
  return res.status(200).json(new ApiResponse(200, "Fee structures loaded.", result));
});

export const getStudentFees = catchAsync(async (req: Request, res: Response) => {
  const schoolId = getSchoolId(req);
  const { classId } = req.query;
  const result = await schoolAdminService.getStudentFees(schoolId, classId ? (classId as string) : undefined);
  return res.status(200).json(new ApiResponse(200, "Student fees loaded.", result));
});

export const allocateFeeToStudent = catchAsync(async (req: Request, res: Response) => {
  const { studentId, feeStructureId, dueDate } = req.body;
  if (!studentId || !feeStructureId || !dueDate) {
    throw new ApiError(400, "studentId, feeStructureId, and dueDate are required");
  }
  const result = await schoolAdminService.allocateFeeToStudent(studentId, feeStructureId, dueDate);
  return res.status(201).json(new ApiResponse(201, "Fee allocated to student.", result));
});

export const recordFeePayment = catchAsync(async (req: Request, res: Response) => {
  const { studentFeeId, amount, paymentMethod } = req.body;
  if (!studentFeeId || !amount || !paymentMethod) {
    throw new ApiError(400, "studentFeeId, amount, and paymentMethod are required");
  }
  const result = await schoolAdminService.recordFeePayment(studentFeeId, Number(amount), paymentMethod);
  return res.status(200).json(new ApiResponse(200, "Fee payment logged successfully.", result));
});

// 9. Library
export const createBook = catchAsync(async (req: Request, res: Response) => {
  const schoolId = getSchoolId(req);
  const result = await schoolAdminService.createBook(schoolId, req.body);
  return res.status(201).json(new ApiResponse(201, "Book registered in library.", result));
});

export const getBooks = catchAsync(async (req: Request, res: Response) => {
  const schoolId = getSchoolId(req);
  const result = await schoolAdminService.getBooks(schoolId);
  return res.status(200).json(new ApiResponse(200, "Library catalog loaded.", result));
});

export const issueBook = catchAsync(async (req: Request, res: Response) => {
  const { studentId, bookId, dueDate } = req.body;
  if (!studentId || !bookId || !dueDate) {
    throw new ApiError(400, "studentId, bookId, and dueDate are required");
  }
  const result = await schoolAdminService.issueBook(studentId, bookId, dueDate);
  return res.status(201).json(new ApiResponse(201, "Book issued successfully.", result));
});

export const returnBook = catchAsync(async (req: Request, res: Response) => {
  const { bookIssueId, fineAmount } = req.body;
  if (!bookIssueId) {
    throw new ApiError(400, "bookIssueId is required");
  }
  const result = await schoolAdminService.returnBook(bookIssueId, fineAmount ? Number(fineAmount) : 0);
  return res.status(200).json(new ApiResponse(200, "Book returned successfully.", result));
});

export const getLibraryIssues = catchAsync(async (req: Request, res: Response) => {
  const schoolId = getSchoolId(req);
  const result = await schoolAdminService.getLibraryIssues(schoolId);
  return res.status(200).json(new ApiResponse(200, "Library issue history loaded.", result));
});

// 10. Transportation
export const createBus = catchAsync(async (req: Request, res: Response) => {
  const schoolId = getSchoolId(req);
  const result = await schoolAdminService.createBus(schoolId, req.body);
  return res.status(201).json(new ApiResponse(201, "Bus registered successfully.", result));
});

export const getBuses = catchAsync(async (req: Request, res: Response) => {
  const schoolId = getSchoolId(req);
  const result = await schoolAdminService.getBuses(schoolId);
  return res.status(200).json(new ApiResponse(200, "Buses loaded.", result));
});

export const createRoute = catchAsync(async (req: Request, res: Response) => {
  const schoolId = getSchoolId(req);
  const result = await schoolAdminService.createRoute(schoolId, req.body);
  return res.status(201).json(new ApiResponse(201, "Route registered successfully.", result));
});

export const getRoutes = catchAsync(async (req: Request, res: Response) => {
  const schoolId = getSchoolId(req);
  const result = await schoolAdminService.getRoutes(schoolId);
  return res.status(200).json(new ApiResponse(200, "Routes loaded.", result));
});

export const createStop = catchAsync(async (req: Request, res: Response) => {
  const { routeId } = req.body;
  if (!routeId) throw new ApiError(400, "routeId is required");
  const result = await schoolAdminService.createStop(routeId, req.body);
  return res.status(201).json(new ApiResponse(201, "Stop registered successfully.", result));
});

export const allocateTransport = catchAsync(async (req: Request, res: Response) => {
  const { studentId, routeId, stopId } = req.body;
  if (!studentId || !routeId || !stopId) {
    throw new ApiError(400, "studentId, routeId, and stopId are required");
  }
  const result = await schoolAdminService.allocateTransport(studentId, routeId, stopId);
  return res.status(200).json(new ApiResponse(200, "Transport allocation saved.", result));
});

export const getTransportAllocations = catchAsync(async (req: Request, res: Response) => {
  const schoolId = getSchoolId(req);
  const result = await schoolAdminService.getTransportAllocations(schoolId);
  return res.status(200).json(new ApiResponse(200, "Transport allocations loaded.", result));
});
