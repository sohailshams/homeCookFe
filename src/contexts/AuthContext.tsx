import axios from "axios";
import { createContext, useContext, useLayoutEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

type AuthContextType = {
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
};
type ContextChildren = {
  children: React.ReactNode;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: ContextChildren) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    // Handle 401 responses (expired tokens)
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          navigate("/", {
            state: { message: "Session expired. Please log in again." },
          });
        }
      }
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
