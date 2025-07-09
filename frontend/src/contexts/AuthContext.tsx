import { useState, useEffect, useContext, createContext } from "react";
import type { ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

export interface UserData {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  isDeletedBy: boolean;
}

interface AuthContextInterface {
  user: UserData | null;
  token: string;
  isLoggedIn: boolean;
  login: (user: UserData, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextInterface | null>(null);

export function AuthProvider({ children }: AuthProviderProps) {
  const [authUser, setAuthUser] = useState<UserData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = {
      id: Number(localStorage.getItem("id")),
      username: localStorage.getItem("username") || "",
      email: localStorage.getItem("email") || "",
      role: localStorage.getItem("role") || "",
      createdAt: new Date(), // You can store actual date if needed
      updatedAt: new Date(),
      isDeletedBy: localStorage.getItem("isDeleted") === "true",
    };

    if (storedToken && storedUser.username) {
      setToken(storedToken);
      setAuthUser(storedUser);
      setIsLoggedIn(true);
    }
  }, []);

  const login = (user: UserData, newToken: string) => {
    setAuthUser(user);
    setToken(newToken);
    setIsLoggedIn(true);

    localStorage.setItem("username", user.username);
    localStorage.setItem("email", user.email);
    localStorage.setItem("role", user.role);
    localStorage.setItem("token", newToken);
    localStorage.setItem("id", user.id.toString());
    localStorage.setItem("isDeleted", user.isDeletedBy.toString());
  };

  const logout = () => {
    setAuthUser(null);
    setIsLoggedIn(false);
    setToken("");
    localStorage.clear();
  };

  const value: AuthContextInterface = {
    user: authUser,
    token,
    isLoggedIn,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
