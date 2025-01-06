import { useAuth } from "@/contexts/AuthContext";
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  return <>{children}</>;
};

export default ProtectedRoute;
