import { Router } from "express";

import {
    uploadVideo,
    uploadPdf,
    uploadImage,
    deleteFile,
} from "../controllers/upload.controller";

import {
    uploadVideo as videoUploader,
    uploadPdf as pdfUploader,
    uploadImage as imageUploader,
} from "../middlewares/upload.middleware";

import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { UserRole } from "@prisma/client";

const router = Router();

router.use(authenticate);

router.post(
    "/video",
    authorize(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN),
    videoUploader.single("video"),
    uploadVideo
);

router.post(
    "/pdf",
    authorize(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN),
    pdfUploader.single("pdf"),
    uploadPdf
);

router.post(
    "/image",
    authorize(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN),
    imageUploader.single("image"),
    uploadImage
);

router.delete(
    "/",
    authorize(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN),
    deleteFile
);

export default router;