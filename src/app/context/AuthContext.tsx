"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
} from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (credentials: {
    email: string;
    password: string;
  }) => Promise<string | null | undefined>;
  logout: () => void;
}

interface User {
  email: string;
  username: string;
  role: any;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const toastShownRef = useRef(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const storedEmail = localStorage.getItem("email");
      const storedUsername = localStorage.getItem("username");
      const storedRoleId = localStorage.getItem("role");

      if (storedToken && storedEmail && storedUsername && storedRoleId) {
        setToken(storedToken);
        setUser({
          email: storedEmail,
          username: storedUsername,
          role:  storedRoleId, // ✅ restore role
        });
        setIsAuthenticated(true);
      } else {
        if (
          !toastShownRef.current &&
          typeof window !== "undefined" &&
          !window.location.pathname.includes("/login")
        ) {
          toastShownRef.current = true;
          toast.error("Your session has expired. Please log in again.");
          router.replace("/login");
        }
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );

      if (response.status === 200 || response.status === 201) {
        const data = await response.json();
        const { token, email, username, role } = data;
        localStorage.setItem("token", token);
        localStorage.setItem("email", email);
        localStorage.setItem("username", username);
        localStorage.setItem("role", role.name.toString());

        setToken(token);
        setIsAuthenticated(true);
        setLoading(false);
        setUser({ email, username, role });
        toast.success("Login successful!");
        router.push("/");
      } else if (response.status === 307) {
        const data = await response.json();
        setLoading(false);
        router.push(`/resetPassword?type=changePasswordt&email=${data.email}`);
      } else {
        const errorMsg = await response.json();
        console.error("Login failed:", errorMsg.error);
        toast.error(errorMsg.error || "Login failed!");
        setLoading(false);
        return error;
      }
    } catch (error) {
      setLoading(false);
      console.error("Error during login:", error);
      toast.error("An unexpected error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear all auth-related data
    localStorage.clear();
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        token,
        loading,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
