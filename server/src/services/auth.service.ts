import { UserRole } from "@prisma/client";
import slugify from "slugify";
import ApiError from "../config/ApiError";
import { prisma } from "../config/db";
import { generateAccessToken, generateRefreshToken } from "../config/jwt";
import { comparePassword, hashPassword } from "../config/password";
import { LoginDto, RegisterSchoolDto } from "../dto/auth.dto";

class AuthService {

    // @desc Register School
    // @route POST /api/v1/auth/register-school
    // @access Public
    async registerSchool(data: RegisterSchoolDto) {

        const slug = slugify(data.schoolName, {
            lower: true,
            strict: true,
            trim: true,
        });

        // Check if school already exists
        const existingSchool = await prisma.school.findFirst({
            where: {
                OR: [
                    {
                        slug,
                    },
                    {
                        email: data.schoolEmail,
                    },
                ],
            },
        });

        if (existingSchool) {
            throw new ApiError(
                409,
                "School already exists."
            );
        }

        // Check if admin already exists
        const existingUser = await prisma.user.findUnique({
            where: {
                email: data.email,
            },
        });

        if (existingUser) {
            throw new ApiError(
                409,
                "User already exists."
            );
        }

        // Hash password
        const hashedPassword = await hashPassword(data.password);

        // Transaction
        const result = await prisma.$transaction(async (tx) => {

            const school = await tx.school.create({
                data: {
                    name: data.schoolName,
                    slug,
                    email: data.schoolEmail,
                    phone: data.schoolPhone,
                },
            });

            const user = await tx.user.create({
                data: {
                    schoolId: school.id,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    password: hashedPassword,
                    phone: data.schoolPhone,
                    role: UserRole.SCHOOL_ADMIN,
                },
            });

            return {
                school,
                user,
            };
        });

        // JWT Payload
        const payload = {
            userId: result.user.id,
            schoolId: result.school.id,
            role: result.user.role,
        };

        // Tokens
        const accessToken = generateAccessToken(payload);

        const refreshToken = generateRefreshToken(payload);

        // Save Refresh Token
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: result.user.id,
                expiresAt: new Date(
                    Date.now() + 7 * 24 * 60 * 60 * 1000
                ),
                revoked: false,
            },
        });

        return {
            school: result.school,
            user: result.user,
            accessToken,
            refreshToken,
        };
    }

    // @desc Login
    // @route POST /api/v1/auth/login
    // @access Public
    async login(data: LoginDto) {

        if (data.email === "admin@apexedu.com" || data.email === "student@apexedu.com") {
            await this.ensureDemoSeeded();
        }

        // Check if user already exists
        const user = await prisma.user.findUnique({
            where: {
                email: data.email,
            },
            include: {
                school: true,
            }
        });

        if (!user) {
            throw new ApiError(
                401,
                "Invalid email or password."
            );
        }

        // check password is valid
        const isPasswordValid = await comparePassword(data.password, user.password);

        if (!isPasswordValid) {
            throw new ApiError(
                401,
                "Invalid email or password."
            );
        }

        // check the user is ACTIVE
        if (user.status !== "ACTIVE") {
            throw new ApiError(
                403,
                "Account is inactive."
            );
        }

        // JWT payload
        const payload = {
            userId: user.id,
            schoolId: user.schoolId,
            role: user.role
        }

        // Generate access and refresh token
        const accessToken = generateAccessToken(payload);

        const refreshToken = generateRefreshToken(payload);

        // save the refresh token
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(
                    Date.now() + 7 * 24 * 60 * 60 * 1000
                ),
                revoked: false,
            }
        });

        // update last login
        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                lastLogin: new Date(),
            }
        });

        const { password, school, ...userWithoutPassword } = user;

        return {
            user: userWithoutPassword,
            school: school,
            accessToken,
            refreshToken,
        };
    }

    async refreshToken() { }

    async logout() { }

    async getCurrentUser(userId: string) { 

        // get the user
        const user = await prisma.user.findUnique({
            where:{
                id: userId,
            },
            include:{
                school:true,
                student: {
                    include: {
                        class: true,
                        section: true,
                        parent: true,
                        fees: {
                            include: {
                                feeStructure: true
                            }
                        },
                        attendances: true,
                        bookIssues: {
                            include: {
                                book: true
                            }
                        },
                        transport: {
                            include: {
                                route: true,
                                stop: true
                            }
                        }
                    }
                }
            }
        });

        // check user exists 
        if(!user){
            throw new ApiError(
                404,
                "User not found."
            )
        };

        // check user status
        if(user.status !== "ACTIVE"){
            throw new ApiError(
                403,
                "Account is inactive."
            );
        };

        // remove password
        const {password, school,...userWithoutPassword} = user;

        return{
            user: userWithoutPassword,
            school: school,
        }
    }

    async changePassword() { }

    async ensureDemoSeeded() {
        const slug = "apex-international-school";
        
        // 1. Check if school exists
        let school = await prisma.school.findUnique({
            where: { slug }
        });

        if (!school) {
            school = await prisma.school.create({
                data: {
                    name: "Apex International School",
                    slug,
                    email: "contact@apexedu.com",
                    phone: "9876543210",
                }
            });
        }

        const hashedPassword = await hashPassword("password123");

        // 2. Check if admin user exists
        let admin = await prisma.user.findUnique({
            where: { email: "admin@apexedu.com" }
        });

        if (!admin) {
            admin = await prisma.user.create({
                data: {
                    schoolId: school.id,
                    firstName: "Principal",
                    lastName: "Apex",
                    email: "admin@apexedu.com",
                    password: hashedPassword,
                    phone: "9876543210",
                    role: UserRole.SCHOOL_ADMIN,
                }
            });
        }

        // 3. Check if academic year exists
        let academicYear = await prisma.academicYear.findFirst({
            where: { schoolId: school.id }
        });

        if (!academicYear) {
            academicYear = await prisma.academicYear.create({
                data: {
                    schoolId: school.id,
                    name: "2026-2027",
                    startDate: new Date("2026-06-01"),
                    endDate: new Date("2027-05-31"),
                    isCurrent: true,
                }
            });
        }

        // 4. Check if class exists
        let cls = await prisma.class.findFirst({
            where: { schoolId: school.id }
        });

        if (!cls) {
            cls = await prisma.class.create({
                data: {
                    schoolId: school.id,
                    academicYearId: academicYear.id,
                    name: "Grade 5",
                    description: "Demo Grade 5 Class",
                }
            });
        }

        // 5. Check if section exists
        let section = await prisma.section.findFirst({
            where: { classId: cls.id }
        });

        if (!section) {
            section = await prisma.section.create({
                data: {
                    classId: cls.id,
                    name: "Section A",
                }
            });
        }

        // 6. Check if parent exists
        let parentUser = await prisma.user.findUnique({
            where: { email: "parent@apexedu.com" }
        });

        if (!parentUser) {
            parentUser = await prisma.user.create({
                data: {
                    schoolId: school.id,
                    firstName: "Parent",
                    lastName: "Apex",
                    email: "parent@apexedu.com",
                    password: hashedPassword,
                    phone: "9876543210",
                    role: UserRole.PARENT,
                }
            });

            await prisma.parent.create({
                data: {
                    userId: parentUser.id,
                    schoolId: school.id,
                    fatherName: "Parent Apex",
                    phone: "9876543210",
                    email: "parent@apexedu.com",
                }
            });
        }

        // 7. Check if student exists
        let studentUser = await prisma.user.findUnique({
            where: { email: "student@apexedu.com" }
        });

        if (!studentUser) {
            studentUser = await prisma.user.create({
                data: {
                    schoolId: school.id,
                    firstName: "Demo",
                    lastName: "Student",
                    email: "student@apexedu.com",
                    password: hashedPassword,
                    phone: "9876543210",
                    role: UserRole.STUDENT,
                }
            });

            const parent = await prisma.parent.findFirst({
                where: { schoolId: school.id }
            });

            await prisma.student.create({
                data: {
                    userId: studentUser.id,
                    parentId: parent!.id,
                    schoolId: school.id,
                    classId: cls.id,
                    sectionId: section.id,
                    admissionNumber: "ADM-2026-001",
                    rollNumber: "01",
                    firstName: "Demo",
                    lastName: "Student",
                    gender: "MALE",
                    dob: new Date("2016-01-01"),
                }
            });
        }
    }
}

export default new AuthService();