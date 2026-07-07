import axios from "axios";
import { tokenService } from "./token";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Request Interceptor: Attach authorization Bearer token dynamically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = tokenService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle standard responses and 401 redirects
axiosInstance.interceptors.response.use(
  (response) => {
    // The backend returns a standard wrapper: { success, statusCode, message, data }
    return response.data;
  },
  (error) => {
    const status = error.response?.status;
    const resData = error.response?.data;

    // Handle session expiration/unauthorized states gracefully
    if (status === 401) {
      if (typeof window !== "undefined") {
        const isStudentPath = window.location.pathname.startsWith("/student");
        tokenService.clearSession();
        window.location.href = isStudentPath ? "/auth/student-login" : "/auth/school-admin-login";
      }
      return Promise.reject(new Error(resData?.message || "Unauthorized session. Please log in again."));
    }

    const errorMessage = resData?.message || error.message || "An error occurred during API request.";
    return Promise.reject(new Error(errorMessage));
  }
);

export const api = {
  get: (path: string, config?: any) => axiosInstance.get(path, config) as any,
  post: (path: string, body?: any, config?: any) => axiosInstance.post(path, body, config) as any,
  put: (path: string, body?: any, config?: any) => axiosInstance.put(path, body, config) as any,
  delete: (path: string, config?: any) => axiosInstance.delete(path, config) as any,
};
