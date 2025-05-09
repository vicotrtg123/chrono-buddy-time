
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "employee";
  active: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
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
  children: ReactNode;
}

// Mock users for initial development
const mockUsers = [
  { 
    id: 1, 
    name: "Admin User", 
    email: "admin@example.com", 
    password: "admin123", 
    role: "admin", 
    active: true 
  },
  { 
    id: 2, 
    name: "Employee One", 
    email: "employee@example.com", 
    password: "employee123", 
    role: "employee", 
    active: true 
  },
];

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for saved user in localStorage on initial load
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse saved user:", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulating API call with mock data
      const foundUser = mockUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (!foundUser) {
        throw new Error("Credenciais inválidas");
      }

      if (!foundUser.active) {
        throw new Error("Conta desativada. Entre em contato com um administrador.");
      }

      // Create user object with proper type assertion for role
      const userWithoutPassword: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role as "admin" | "employee",
        active: foundUser.active
      };
      
      setUser(userWithoutPassword);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      
      toast.success(`Bem-vindo, ${foundUser.name}!`);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(error instanceof Error ? error.message : "Falha ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.info("Logout realizado com sucesso");
    navigate("/login");
  };

  const isAdmin = () => {
    return user?.role === "admin";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
