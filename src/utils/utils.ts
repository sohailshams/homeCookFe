import { format } from "date-fns";
import { UseFormSetValue, UseFormTrigger } from "react-hook-form";

export const formatDate = (date: Date | string | null | undefined) => {
  if (date === null || date === undefined) return null;
  else return format(new Date(date), "MM/dd/yyyy");
};

export const incrementFoodQuantity = (
  currentQuantity: number,
  setValue: UseFormSetValue<any>,
  trigger: UseFormTrigger<any>,
  fieldName: string
) => {
  setValue(fieldName, currentQuantity + 1);
  trigger(fieldName);
};

export const decrementFoodQuantity = (
  currentQuantity: number,
  setValue: UseFormSetValue<any>,
  trigger: UseFormTrigger<any>,
  fieldName: string
) => {
  setValue(fieldName, currentQuantity - 1);
  trigger(fieldName);
};
