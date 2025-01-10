import { LoginRegisterFormInputs } from "@/components/Types/Types";
import axios from "axios";

const homeCookApi = axios.create({
  baseURL: "https://localhost:7145/api",
  withCredentials: true,
  params: { useCookies: true },
});

export const loginUser = async (data: LoginRegisterFormInputs) => {
  return await homeCookApi.post("/login", data);
};

export const registerUser = async (data: LoginRegisterFormInputs) => {
  return await homeCookApi.post("/register", data);
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
