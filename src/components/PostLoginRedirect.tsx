import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Spinner from "./Spinner";

const PostLoginRedirect: React.FC = () => {
  const { user, isReady, postcode } = useAuth();
  console.log("inside postLogin", isReady);
  //   if (isReady) return <Spinner />;
  console.log(
    "postLoginRedirect",
    localStorage.getItem("userPostcode"),
    postcode,
  );

  if (!user) return <Navigate to="/" />;

  if (!postcode) return <Navigate to="/postcode-search" />;

  return <Navigate to="/food-list" />;
};

export default PostLoginRedirect;
