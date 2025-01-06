import { LoginFormInputs } from "@/components/Login";
import axios from "axios";

const homeCookApi = axios.create({
  baseURL: "https://localhost:7145/api",
  withCredentials: true,
  params: { useCookies: true },
});

export const loginUser = async (data: LoginFormInputs) => {
  return await homeCookApi.post("/login", data);
};

export const fetchUserInfo = async () => {
  return await homeCookApi.get("/user");
};

export const fetchFoodList = async () => {
  const response = await homeCookApi.get("/food");
  return response.data;
};

export const logoutUser = async () => {
  const response = await homeCookApi.post("/logout", {});
  return response.data;
};
