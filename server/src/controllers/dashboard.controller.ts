import { Request, Response } from "express";

import catchAsync from "../config/catchAsync";
import dashboardService from "../services/dashboard.service";

class DashboardController {

    getAdminDashboard = catchAsync(
        async (req: Request, res: Response) => {

            const dashboard = await dashboardService.getAdminDashboard(
                req.user.schoolId
            );

            res.status(200).json({
                success: true,
                message: "Dashboard fetched successfully.",
                data: dashboard,
            });

        }
    );

}

export default new DashboardController();