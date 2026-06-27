const BASE_URL = "http://localhost:8000/api/v1";

interface RequestOptions extends RequestInit {
  body?: any;
}

async function apiFetch(path: string, options: RequestOptions = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = new Headers(options.headers || {});
  headers.append("Accept", "application/json");

  // Only append content-type if not sending FormData
  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.append("Content-Type", "application/json");
  }

  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers,
  };

  if (options.body && !(options.body instanceof FormData)) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${BASE_URL}${path}`, fetchOptions);

  if (response.status === 401) {
    if (typeof window !== "undefined") {
      const isStudentPath = window.location.pathname.startsWith("/student");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = isStudentPath ? "/auth/student-login" : "/auth/school-admin-login";
    }
    throw new Error("Unauthorized session. Please log in again.");
  }

  const resJson = await response.json();

  if (!response.ok) {
    throw new Error(resJson.message || "An error occurred during api fetch request.");
  }

  return resJson;
}

export const api = {
  get: (path: string, options?: RequestOptions) =>
    apiFetch(path, { ...options, method: "GET" }),
  post: (path: string, body?: any, options?: RequestOptions) =>
    apiFetch(path, { ...options, method: "POST", body }),
  put: (path: string, body?: any, options?: RequestOptions) =>
    apiFetch(path, { ...options, method: "PUT", body }),
  delete: (path: string, options?: RequestOptions) =>
    apiFetch(path, { ...options, method: "DELETE" }),
};
