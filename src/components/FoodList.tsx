import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import Spinner from "./Spinner";
import { fetchFoodList } from "@/api/api";
import { Food } from "./Types/Types";
import FoodCard from "./FoodCard";

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
      <div className="grid max-[375px]:grid-cols-1 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-4 max-w-[90%] mx-auto">
        {food?.map((food: Food) => (
          <FoodCard key={food.id} food={food} />
        ))}
      </div>
    </div>
  );
};

export default FoodList;
