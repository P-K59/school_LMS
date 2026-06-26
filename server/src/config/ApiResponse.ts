class ApiResponse<T = unknown> {
    public success: boolean;
    public statusCode: number;
    public message: string;
    public data: T | null;

    constructor(
        statusCode: number,
        message: string = "Success",
        data: T | null = null
    ) {
        this.success = true;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }
}

export default ApiResponse;