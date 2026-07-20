import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { getToken, clearTokens, USER_STORAGE } from "@/services/auth.storage";
import { type User } from "@/interfaces/user.interface";
import { storage } from "@/services/storage";
import { useQueryClient } from "@tanstack/react-query";

type AuthContextValue = {
  isAuthenticated: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const readInitialAuth = (): boolean => {
  return !!getToken();
};

const readInitialUser = (): User | null => {
  const userJson = storage.get(USER_STORAGE);
  if (userJson) {
    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  }
  return null;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(readInitialAuth);
  const [user, setUser] = useState<User | null>(readInitialUser);
  const queryClient = useQueryClient();

  const login = useCallback((userData: User) => {
    queryClient.clear();
    setIsAuthenticated(true);
    setUser(userData);
  }, [queryClient]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    clearTokens();
    queryClient.clear();
  }, [queryClient]);

  const updateUser = useCallback((userData: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      const newUser = { ...prevUser, ...userData };
      storage.set(USER_STORAGE, JSON.stringify(newUser));
      return newUser;
    });
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, user, login, logout, updateUser }),
    [isAuthenticated, user, login, logout, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};

export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const { tenantSlug } = useParams<{ tenantSlug: string }>();

  if (!isAuthenticated) {
    const from = location.pathname + location.search;
    const loginPath = tenantSlug
      ? `/t/${tenantSlug}/login`
      : "/login";
    return <Navigate to={loginPath} replace state={{ from }} />;
  }

  return <>{children}</>;
};

export const RequireRole = ({
  children,
  allowedRoles,
}: {
  children: ReactNode;
  allowedRoles: string[];
}) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const { tenantSlug } = useParams<{ tenantSlug: string }>();

  if (!isAuthenticated) {
    const from = location.pathname + location.search;
    const loginPath = tenantSlug
      ? `/t/${tenantSlug}/login`
      : "/login";
    return <Navigate to={loginPath} replace state={{ from }} />;
  }

  if (!user || !user.role || !allowedRoles.includes(user.role)) {
    const redirectPath = tenantSlug
      ? `/t/${tenantSlug}/app`
      : "/app";
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};
