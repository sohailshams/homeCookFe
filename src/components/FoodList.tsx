import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import Spinner from "./Spinner";
import { fetchFoodList, logoutUser } from "@/api/api";

const FoodList: React.FC = () => {
  const {
    data: food,
    isLoading,
    isError,
  } = useQuery({
    queryFn: () => fetchFoodList(),
    queryKey: ["foodList"],
  });

  if (isError) {
    toast.error("Error fetching food list from database.", {
      duration: Infinity,
      action: {
        label: <X />,
        onClick: () => toast.dismiss(),
      },
      id: "fetching-error-toast",
    });
  }

  if (isLoading) return <Spinner />;

  return (
    <div>
      <h1>Food List</h1>
      <ul>
        {food?.map((item: { id: number; name: string }) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default FoodList;
