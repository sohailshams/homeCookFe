import {
  CloudinarySignatureTimeStamp,
  CreatePaymentIntent,
  SignedImageUploadInput,
  LoginRegisterFormInputs,
  UserProfile,
} from "@/components/Types/Types";
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

export const fetchCategories = async () => {
  const response = await homeCookApi.get("/category");
  return response.data;
};

export const fetchFoodByCategory = async (categoryId: number) => {
  const response = await homeCookApi.get(`/food/food-category/${categoryId}`);
  return response.data;
};

export const fetchFoodDetail = async (foodId: string | undefined) => {
  const response = await homeCookApi.get(`/food/${foodId}`);
  return response.data;
};

export const fetchUserProfile = async (userId: number | undefined) => {
  const response = await homeCookApi.get(`/profile/${userId}`);
  return response.data;
};

export const addProfile = async (data: Omit<UserProfile, "id">) => {
  const response = await homeCookApi.post("/profile", data);
  return response.data;
};

export const updateProfile = async (data: Omit<UserProfile, "id">) => {
  const response = await homeCookApi.put("/profile/update-profile", data);
  return response.data;
};

export const createPaymentIntent = async (data: CreatePaymentIntent) => {
  const response = await homeCookApi.post("/CreatePaymentIntent", data);
  return response.data;
};

export const search = async (searchTerm: string) => {
  const response = await homeCookApi.get(`/FoodSearch`, {
    params: { foodSearchTerm: searchTerm },
  });
  return response.data;
};

export const createCloudinarySignature = async (): Promise<CloudinarySignatureTimeStamp>  => {
  const response = await homeCookApi.post("/Cloudinary/signature", {});
  return response.data;
};

export const uploadToCloudinary = async (cloudName: string,  imageUploadData: FormData) => {
  debugger;
  const response = await axios.create({
  }).post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, imageUploadData);
  return response.data;
};
