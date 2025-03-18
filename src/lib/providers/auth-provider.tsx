// lib/providers/auth-provider.tsx
"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useState,
  ReactNode,
} from "react";
import apiClient from "@/lib/api/client";
import {
  setTokens,
  clearTokens,
  getUser as getUserFromStorage,
  setUser as setUserInStorage,
  isAuthenticated as checkIsAuthenticated,
} from "@/lib/auth";
import { User } from "@/types/user";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

// Create context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateUser: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth state
  useEffect(() => {
    const initAuth = () => {
      try {
        const authenticated = checkIsAuthenticated();
        setIsAuthenticated(authenticated);

        if (authenticated) {
          const storedUser = getUserFromStorage();
          if (storedUser) {
            setUser(storedUser);
          } else {
            // If token exists but no user data, fetch user data
            fetchUserData();
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        clearTokens();
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Fetch user data from API
  const fetchUserData = async () => {
    try {
      const response = await apiClient.get("/accounts/users/me/");
      const userData = response.data;
      setUser(userData);
      setUserInStorage(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
      clearTokens();
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post("/accounts/token/", {
        email,
        password,
      });

      const { access, refresh } = response.data;
      setTokens(access, refresh);
      setIsAuthenticated(true);

      // Fetch user data
      await fetchUserData();
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(
        error.response?.data?.detail ||
          "Login failed. Please check your credentials."
      );
    }
  };

  // Register function
  const register = async (userData: Partial<User>) => {
    try {
      await apiClient.post("/accounts/users/", {
        ...userData,
        password2: userData.password, // API expects password2 field
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      throw new Error(
        error.response?.data?.detail || "Registration failed. Please try again."
      );
    }
  };

  // Logout function
  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // Update user function
  const updateUser = async (userData: Partial<User>) => {
    try {
      const { data } = await apiClient.patch(
        `/accounts/users/${user?.id}/`,
        userData
      );
      setUser({ ...user, ...data } as User);
      setUserInStorage({ ...user, ...data } as User);
      return data;
    } catch (error: any) {
      console.error("Update user error:", error);
      throw new Error(
        error.response?.data?.detail || "Failed to update user information."
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
