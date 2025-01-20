import { format } from "date-fns";

export const formatDate = (date: Date | string | null | undefined) => {
  if (date === null || date === undefined) return null;
  else return format(new Date(date), "MM/dd/yyyy");
};
