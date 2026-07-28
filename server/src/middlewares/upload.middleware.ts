import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuid } from "uuid";
import ApiError from "../config/ApiError";

const createStorage = (folder: string) => {

    const destination = path.join(process.cwd(), "uploads", folder);

    if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
    }

    return multer.diskStorage({

        destination(req, file, cb) {
            cb(null, destination);
        },

        filename(req, file, cb) {
            const extension = path.extname(file.originalname);
            cb(null, `${uuid()}${extension}`);
        },
    });
};

const videoTypes = [
    "video/mp4",
    "video/quicktime",
    "video/x-msvideo",
    "video/x-matroska",
];

const imageTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

const pdfTypes = [
    "application/pdf",
];

export const uploadVideo = multer({
    storage: createStorage("videos"),
    limits: {
        fileSize: 500 * 1024 * 1024, // 500 MB
    },
    fileFilter(req, file, cb) {

        if (!videoTypes.includes(file.mimetype)) {
            return cb(new ApiError(400, "Only video files are allowed."));
        }

        cb(null, true);
    },
});

export const uploadPdf = multer({
    storage: createStorage("pdfs"),
    limits: {
        fileSize: 20 * 1024 * 1024,
    },
    fileFilter(req, file, cb) {

        if (!pdfTypes.includes(file.mimetype)) {
            return cb(new ApiError(400, "Only PDF files are allowed."));
        }

        cb(null, true);
    },
});

export const uploadImage = multer({
    storage: createStorage("images"),
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
    fileFilter(req, file, cb) {

        if (!imageTypes.includes(file.mimetype)) {
            return cb(new ApiError(400, "Only image files are allowed."));
        }

        cb(null, true);
    },
});