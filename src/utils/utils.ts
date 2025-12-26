import { createCloudinarySignature, uploadToCloudinary } from "@/api/api";
import { CloudinaryImageResponse } from "@/components/Types/Types";
import { format } from "date-fns";
import { UseFormSetValue, UseFormTrigger } from "react-hook-form";

export const formatDate = (date: Date | string | null | undefined) => {
  if (date === null || date === undefined) return null;
  else return format(new Date(date), "MM/dd/yyyy");
};

export const incrementFoodQuantity = (
  currentQuantity: number,
  setValue: UseFormSetValue<{
    foodQuantity: number;
  }>,
  trigger: UseFormTrigger<{
    foodQuantity: number;
  }>,
  fieldName: "foodQuantity"
) => {
  setValue(fieldName, currentQuantity + 1);
  trigger(fieldName);
};

export const decrementFoodQuantity = (
  currentQuantity: number,
  setValue: UseFormSetValue<{
    foodQuantity: number;
  }>,
  trigger: UseFormTrigger<{
    foodQuantity: number;
  }>,
  fieldName: "foodQuantity"
) => {
  setValue(fieldName, currentQuantity - 1);
  trigger(fieldName);
};

export const uploadImagesToCloudinary = async (images: File[]): Promise<CloudinaryImageResponse[]> => {

  const signatureResponse = await createCloudinarySignature();

  const { timestamp, signature } = signatureResponse;

  // 2. Upload each file
  const uploadPromises = images.map(async (image) => {
   const formData = new FormData();
    formData.append("file", image);
    formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("upload_preset", "homeCook");

    return uploadToCloudinary(import.meta.env.VITE_CLOUDINARY_CLOUD_NAME, formData)
    .then((response) => {
      return response;
    });
  });

  return Promise.all(uploadPromises);

}
