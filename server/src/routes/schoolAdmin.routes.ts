import { Router } from "express";
import * as controller from "../controllers/schoolAdmin.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { UserRole } from "@prisma/client";

const router = Router();

// Apply auth middleware to all endpoints in this router
router.use(authenticate);

// Limit routes to School Admin or principal/vice principal/teacher where appropriate
const schoolStaff = [
  UserRole.SCHOOL_ADMIN,
  UserRole.PRINCIPAL,
  UserRole.VICE_PRINCIPAL,
  UserRole.TEACHER,
];

// 1. Dashboard statistics
router.get("/dashboard/stats", authorize(...schoolStaff), controller.getDashboardStats);

// 2. Setup (Academic Years, Classes & Sections)
router.post("/academic-years", authorize(UserRole.SCHOOL_ADMIN), controller.createAcademicYear);
router.get("/academic-years", authorize(...schoolStaff), controller.getAcademicYears);

router.post("/classes", authorize(UserRole.SCHOOL_ADMIN), controller.createClass);
router.get("/classes", authorize(...schoolStaff), controller.getClasses);

router.post("/sections", authorize(UserRole.SCHOOL_ADMIN), controller.createSection);
router.get("/sections", authorize(...schoolStaff), controller.getSections);

// 3. Subject Management
router.post("/subjects", authorize(UserRole.SCHOOL_ADMIN), controller.createSubject);
router.get("/subjects", authorize(...schoolStaff), controller.getSubjects);

// 4. Student Management
router.post("/students", authorize(UserRole.SCHOOL_ADMIN), controller.registerStudent);
router.get("/students", authorize(...schoolStaff), controller.getStudents);
router.post("/students/import", authorize(UserRole.SCHOOL_ADMIN), controller.bulkImportStudents);

// 5. Teacher Management
router.post("/teachers", authorize(UserRole.SCHOOL_ADMIN), controller.registerTeacher);
router.get("/teachers", authorize(...schoolStaff), controller.getTeachers);
router.post("/teachers/assign-subjects", authorize(UserRole.SCHOOL_ADMIN), controller.assignSubjectsToTeacher);

// 6. Attendance Management
router.post("/attendance", authorize(...schoolStaff), controller.markAttendance);
router.get("/attendance", authorize(...schoolStaff), controller.getAttendance);

// 7. Fee Management
router.post("/fees/structures", authorize(UserRole.SCHOOL_ADMIN), controller.createFeeStructure);
router.get("/fees/structures", authorize(...schoolStaff), controller.getFeeStructures);
router.get("/fees/student-fees", authorize(...schoolStaff), controller.getStudentFees);
router.post("/fees/allocate", authorize(UserRole.SCHOOL_ADMIN), controller.allocateFeeToStudent);
router.post("/fees/pay", authorize(UserRole.SCHOOL_ADMIN), controller.recordFeePayment);

// 8. Library Management
router.post("/library/books", authorize(UserRole.SCHOOL_ADMIN), controller.createBook);
router.get("/library/books", authorize(...schoolStaff), controller.getBooks);
router.post("/library/issue", authorize(UserRole.SCHOOL_ADMIN), controller.issueBook);
router.post("/library/return", authorize(UserRole.SCHOOL_ADMIN), controller.returnBook);
router.get("/library/issues", authorize(...schoolStaff), controller.getLibraryIssues);

// 9. Transportation Management
router.post("/transport/buses", authorize(UserRole.SCHOOL_ADMIN), controller.createBus);
router.get("/transport/buses", authorize(...schoolStaff), controller.getBuses);
router.post("/transport/routes", authorize(UserRole.SCHOOL_ADMIN), controller.createRoute);
router.get("/transport/routes", authorize(...schoolStaff), controller.getRoutes);
router.post("/transport/stops", authorize(UserRole.SCHOOL_ADMIN), controller.createStop);
router.post("/transport/allocate", authorize(UserRole.SCHOOL_ADMIN), controller.allocateTransport);
router.get("/transport/allocations", authorize(...schoolStaff), controller.getTransportAllocations);

export default router;
