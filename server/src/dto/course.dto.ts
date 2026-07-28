export interface CreateCourseDto {
    title: string;
    description?: string;
    thumbnail?: string;
    price?: number;
}

export interface UpdateCourseDto {
    title?: string;
    description?: string;
    thumbnail?: string;
    price?: number;
    status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}