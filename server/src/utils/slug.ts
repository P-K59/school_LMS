import slugify from "slugify";

export const generateSlug = (
    schoolName: string
): string => {

    return slugify(schoolName, {
        lower: true,
        strict: true,
        trim: true,
    });

};