export interface UserSession {
  token: string | null;
  user: any | null;
  school: any | null;
}

export const tokenService = {
  getToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  },
  getUser: (): any | null => {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },
  getSchool: (): any | null => {
    if (typeof window === "undefined") return null;
    const schoolStr = localStorage.getItem("school");
    if (!schoolStr) return null;
    try {
      return JSON.parse(schoolStr);
    } catch {
      return null;
    }
  },
  setSession: (token: string, user: any, school: any): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    if (school) {
      localStorage.setItem("school", JSON.stringify(school));
    } else {
      localStorage.removeItem("school");
    }
  },
  clearSession: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("school");
  }
};
