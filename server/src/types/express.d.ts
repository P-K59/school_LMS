import { UserRole } from "@prisma/client";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                schoolId: string | null;
                role: UserRole;
            };
        }
    }
}

export {};