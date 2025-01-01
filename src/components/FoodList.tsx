import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const fetchFoodList = async () => {
  const parameters = { useCookies: true };
  const response = await axios.get("https://localhost:7145/api/food", {
    withCredentials: true,
    params: parameters,
  });
  return response.data;
};

const FoodList: React.FC = () => {
  const { user } = useAuth();

  const {
    data: food,
    isLoading,
    isError,
  } = useQuery({
    queryFn: () => fetchFoodList(),
    queryKey: ["foodList"],
  });

  console.log("food", food);
  console.log("user", user);

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

  if (isLoading) return <div>Loading food list...</div>;

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
