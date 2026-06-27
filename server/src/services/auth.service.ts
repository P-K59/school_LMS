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
                school:true
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
}

export default new AuthService();