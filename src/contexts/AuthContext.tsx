import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

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
  // axios.defaults.withCredentials = true;
  axios.defaults.headers.post["Content-Type"] = "application/json";
  // axios.defaults.headers.post["withCredentials"] = true;
  // useEffect(() => {
  //   // Attempt to fetch a new access token on page load
  //   const fetchToken = async () => {
  //     try {
  //       const response = await axios.post(
  //         "https://localhost:7145/api/refresh", // Endpoint to refresh token
  //         {}, // No body required
  //         { params: { useCookies: true } }
  //         // { withCredentials: true } // Ensure cookies are sent
  //       );
  //       setToken(response.data.accessToken);
  //       console.log("Token refreshed successfully:", response.data.accessToken);
  //     } catch (error) {
  //       console.error("Failed to refresh token:", error);
  //       setToken(null);
  //     }
  //   };

  //   fetchToken();
  // }, []);

  useLayoutEffect(() => {
    // Add Axios request interceptor
    const requestInterceptor = axios.interceptors.request.use((config) => {
      config.withCredentials = true;
      // config.headers.Authorization = token
      //   ? `Bearer ${token}`
      //   : config.headers.Authorization;
      return config;
    });

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, [token]);

  useLayoutEffect(() => {
    // Handle 401 responses (expired tokens)
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 && !error.config._retry) {
          error.config._retry = true; // Prevent infinite loops
          try {
            console.log("sedond useLayoutEffect");
            // Refresh the access token
            const refreshResponse = await axios.post(
              "https://localhost:7145/api/refresh", // Microsoft Identity refresh endpoint
              {},
              // { withCredentials: true } // Send the refresh token cookie
              { params: { useCookies: true } }
            );
            setToken(refreshResponse.data.accessToken); // Update token in state
            error.config.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
            return axios(error.config); // Retry the failed request
          } catch (refreshError) {
            setToken(null);
            console.error("Token refresh failed", refreshError);
          }
        }
        throw error;
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
