"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "../lib/api";
import { tokenService } from "../lib/token";

export interface User {
  id: string;
  schoolId: string | null;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
  phone: string | null;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface School {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone: string | null;
  logo: string | null;
  status: string;
}

interface AuthContextType {
  user: User | null;
  school: School | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  registerSchool: (payload: any) => Promise<any>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [school, setSchool] = useState<School | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize and check for existing session
  useEffect(() => {
    const initAuth = async () => {
      const token = tokenService.getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Restore temporary UI values while fetching live profile
      const localUser = tokenService.getUser();
      const localSchool = tokenService.getSchool();
      if (localUser) {
        setUser(localUser);
        setSchool(localSchool);
        setIsAuthenticated(true);
      }

      try {
        await fetchProfile();
      } catch {
        // Token was invalid or expired
        tokenService.clearSession();
        setUser(null);
        setSchool(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const fetchProfile = async () => {
    const res = await api.get("/auth/me");
    if (res.success && res.data) {
      const { user: fetchedUser, school: fetchedSchool } = res.data;
      setUser(fetchedUser);
      setSchool(fetchedSchool);
      setIsAuthenticated(true);
      tokenService.setSession(tokenService.getToken()!, fetchedUser, fetchedSchool);
    } else {
      throw new Error("Failed to load user profile");
    }
  };

  const getDashboardRoute = (role: string): string => {
    switch (role) {
      case "SUPER_ADMIN":
        return "/superadmin/dashboard";
      case "STUDENT":
        return "/student/dashboard";
      case "PARENT":
        return "/parent/dashboard";
      default:
        // All other school staff (SCHOOL_ADMIN, PRINCIPAL, TEACHER, etc.) go to school-admin dashboard
        return "/school-admin/dashboard";
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.success && res.data) {
        const { user: loggedInUser, school: loggedInSchool, accessToken } = res.data;
        
        tokenService.setSession(accessToken, loggedInUser, loggedInSchool);
        setUser(loggedInUser);
        setSchool(loggedInSchool);
        setIsAuthenticated(true);

        const route = getDashboardRoute(loggedInUser.role);
        router.push(route);
        return res;
      } else {
        throw new Error(res.message || "Login failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const registerSchool = async (payload: any) => {
    setIsLoading(true);
    try {
      const res = await api.post("/auth/register-school", payload);
      if (res.success && res.data) {
        const { user: loggedInUser, school: loggedInSchool, accessToken } = res.data;
        
        tokenService.setSession(accessToken, loggedInUser, loggedInSchool);
        setUser(loggedInUser);
        setSchool(loggedInSchool);
        setIsAuthenticated(true);

        router.push("/school-admin/dashboard");
        return res;
      } else {
        throw new Error(res.message || "Registration failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    tokenService.clearSession();
    setUser(null);
    setSchool(null);
    setIsAuthenticated(false);
    router.push("/");
  };

  const refreshUser = async () => {
    try {
      await fetchProfile();
    } catch (e) {
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        school,
        isAuthenticated,
        isLoading,
        login,
        registerSchool,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
