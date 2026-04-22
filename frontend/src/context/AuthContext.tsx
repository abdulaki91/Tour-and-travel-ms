import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/auth";
import type { AuthUser } from "../types";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateUser: (user: AuthUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = authService.getToken();
        if (token) {
          const response = await authService.getProfile();
          if (response.success) {
            setUser(response.data);
          } else {
            authService.logout();
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      if (response.success) {
        const { user, tokens } = response.data;
        authService.setAuth(tokens.accessToken, user);
        setUser(user);
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      // Prioritize specific error message over generic message
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.message || "Login failed");
      }
    }
  };

  const register = async (data: any) => {
    try {
      const response = await authService.register(data);
      if (response.success) {
        const { user, tokens } = response.data;
        authService.setAuth(tokens.accessToken, user);
        setUser(user);
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      // Prioritize specific error message over generic message
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.message || "Registration failed");
      }
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUser = (updatedUser: AuthUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
