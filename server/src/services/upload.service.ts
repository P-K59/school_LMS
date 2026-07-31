import fs from "fs/promises";
import path from "path";
import ApiError from "../config/ApiError";

class UploadService {

    uploadVideo(file: any) {

        if (!file) {
            throw new ApiError(400, "Video is required.");
        }

        return {
            filename: file.filename,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            url: `/uploads/videos/${file.filename}`,
        };
    }

    uploadPdf(file: any) {

        if (!file) {
            throw new ApiError(400, "PDF is required.");
        }

        return {
            filename: file.filename,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            url: `/uploads/pdfs/${file.filename}`,
        };
    }

    uploadImage(file: any) {

        if (!file) {
            throw new ApiError(400, "Image is required.");
        }

        return {
            filename: file.filename,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            url: `/uploads/images/${file.filename}`,
        };
    }

    async deleteFile(fileUrl: string) {

        if (!fileUrl) {
            throw new ApiError(400, "File URL is required.");
        }

        const filePath = path.join(
            process.cwd(),
            fileUrl.replace(/^\//, "")
        );

        try {

            await fs.access(filePath);
            await fs.unlink(filePath);

            return {
                success: true,
                message: "File deleted successfully.",
            };

        } catch {

            throw new ApiError(404, "File not found.");
        }
    }
}

export default new UploadService();