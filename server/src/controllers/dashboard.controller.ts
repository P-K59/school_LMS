import ApiError from "../config/ApiError";
import catchAsync from "../config/catchAsync";
import dashboardService from "../services/dashboard.service";


export const getAdminDashboard = catchAsync(async (req, res) => {

    if (!req.user) {
        throw new ApiError(401, "Unauthorized");
    }

    const schoolId = req.user.schoolId;

    if (!schoolId) {
        throw new ApiError(401, "Unauthorized");
    }

    const dashboard = await dashboardService.getAdminDashboard(
        schoolId
    );

    res.status(200).json({
        success: true,
        message: "Admin dashboard fetched successfully.",
        data: dashboard,
    });

});

export const getStudentDashboard = catchAsync(async (req, res) => {

    if (!req.user) {
        throw new ApiError(401, "Unauthorized");
    }

    const userId = req.user.id;

    const dashboard = await dashboardService.getStudentDashboard(
        userId
    );

    res.status(200).json({
        success: true,
        message: "Student dashboard fetched successfully.",
        data: dashboard,
    });

});