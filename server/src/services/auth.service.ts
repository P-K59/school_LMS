import ApiError from "../config/ApiError";
import { prisma } from "../config/db";
import { hashPassword } from "../config/password";
import { RegisterSchoolDto } from "../dto/auth.dto";
import slugify from "slugify"
class AuthService {

    async registerSchool(data: RegisterSchoolDto) {

        const existingSchool = await prisma.school.findFirst({
            where: {
                OR: [
                    {
                        name: data.schoolName,
                    },
                    {
                        email: data.schoolEmail,
                    }
                ]
            }
        });

        if (existingSchool) {
            throw new ApiError(409, "School already exits");
        };

        const existingUser = await prisma.user.findUnique({
            where: {
                email: data.email,
            }
        });

        if (existingUser) {
            throw new ApiError(409, "User already exits");
        };

        const hashedPassword = await hashPassword(data.password);

        const slug = slugify(data.schoolName, {
            lower: true,
            strict: true,
            trim: true,
        });

        const result = await prisma.$transaction(async (tx) => {

            const school = await tx.school.create({
                data: {
                    name: data.schoolName,
                    slug: slug,
                    email: data.schoolEmail,
                    phone: data.schoolPhone,
                }
            });

            const user = await tx.user.create({
                data:{
                    schoolId: school.id,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    password: hashedPassword,
                    phone: data.schoolPhone,
                    role: "SCHOOL_ADMIN",
                }
            });

            return{
                school,
                user
            }
        });
    }

    async login() {

    }

    async refreshToken() {

    }

    async logout() {

    }

    async getCurrentUser() {

    }

    async changePassword() {

    }

}

export default new AuthService();