import { LoginFormInputs } from "@/components/ui/Login";
import axios from "axios";

const homeCookApi = axios.create({
  baseURL: "https://localhost:7145/api",
});

export const loginUser = async (data: LoginFormInputs) => {
  const parameters = { useCookies: true };
  return await homeCookApi.post("/login", data, {
    withCredentials: true,
    params: parameters,
  });
};

export const fetchUserInfo = async () => {
  return await homeCookApi.get("/user", {
    withCredentials: true,
  });
};
