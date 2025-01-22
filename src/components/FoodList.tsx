import { Info, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import Spinner from "./Spinner";
import { fetchFoodByCategory, fetchFoodList } from "@/api/api";
import { Food } from "./Types/Types";
import FoodCard from "./FoodCard";
import Categories from "./Categories";
import { useState } from "react";
import { Alert, AlertDescription } from "./ui/alert";

const FoodList: React.FC = () => {
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const {
    data: food,
    isLoading,
    isError,
  } = useQuery({
    queryFn: () =>
      categoryId ? fetchFoodByCategory(categoryId) : fetchFoodList(),
    queryKey: ["foodList", categoryId],
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
      <Categories setCategoryId={setCategoryId} />
      {food.length > 0 ? (
        <div className="grid max-[375px]:grid-cols-1 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-4 max-w-[90%] mx-auto">
          {food?.map((food: Food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      ) : (
        <Alert className="mt-10 w-5/6 mx-auto bg-red-100">
          <AlertDescription className="flex items-center justify-center gap-x-2 text-xl text-gray-700 max-sm:text-sm">
            <Info />
            No food available in this category, please try another category.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default FoodList;
