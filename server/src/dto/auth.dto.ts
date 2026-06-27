export interface RegisterSchoolDto {
    schoolName: string;
    schoolEmail: string;
    schoolPhone: string;
    schoolAddress?: string;

    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface LoginDto {
    email: string;
    password: string;
}