import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { fetchUserInfo, loginUser } from "@/api/api";

export type LoginFormInputs = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      toast.error(location.state.message, {
        duration: Infinity,
        action: {
          label: <X />,
          onClick: () => toast.dismiss(),
        },
        id: "session-expired-toast",
      });
    }
  }, [location.state]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const { mutate: loginMutation } = useMutation({
    mutationFn: loginUser,
    onError: () => {
      setUser(null);
      localStorage.removeItem("user");
      toast.error("Failed to login, please try again", {
        duration: Infinity,
        action: {
          label: <X />,
          onClick: () => toast.dismiss(),
        },
        id: "login-fail-toast",
      });
      navigate("/");
    },

    onSuccess: async () => {
      const userInfo = await fetchUserInfo();
      setUser(userInfo);
      localStorage.setItem("user", JSON.stringify(userInfo));

      navigate("/food-list");
    },
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    loginMutation(data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-2xl font-bold text-center text-gray-700">
          Login
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              className={`w-full px-3 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className={`w-full px-3 py-2 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
