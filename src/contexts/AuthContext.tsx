import { fetchUserInfo } from "@/api/api";
import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

export type User = {
  id: string;
  userName: string;
  userEmail: string | null;
  isProfileComplete: boolean;
  userImageUrl?: string;
};

type AuthContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};
type ContextChildren = {
  children: React.ReactNode;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: ContextChildren) => {
  const localUser = localStorage.getItem("user");
  const parsedUser = localUser ? JSON.parse(localUser) : null;
  const [user, setUser] = useState<any | null>(parsedUser);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (user === null) {
        navigate("/");
        return;
      }
      try {
        const response = await fetchUserInfo();
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
      } catch (error) {
        setUser(null);
        localStorage.removeItem("user");
        navigate("/", {
          state: { message: "Session expired. Please login again." },
        });
      }
    };

    fetchUser();
  }, []);

  useLayoutEffect(() => {
    // Handle 401 responses (expired tokens)
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("user");
          navigate("/", {
            state: { message: "Session expired. Please login again." },
          });
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
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
