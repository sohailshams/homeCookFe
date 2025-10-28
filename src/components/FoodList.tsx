import { Info, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import Spinner from "./Spinner";
import { fetchFoodByCategory, fetchFoodList, search } from "@/api/api";
import { Food } from "./Types/Types";
import FoodCard from "./FoodCard";
import { Alert, AlertDescription } from "./ui/alert";
import { useSearchParams } from "react-router-dom";

interface FoodListProps {
  categoryId: number | null;
}

const FoodList: React.FC<FoodListProps> = ({ categoryId }) => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  const {
    data: food,
    isLoading,
    isError,
    isSuccess
  } = useQuery({
    queryFn: () => {
      if (query && !categoryId) {
        return search(query);
      }
      return categoryId ? fetchFoodByCategory(categoryId) : fetchFoodList();
    },
    queryKey: ["foodList", categoryId, query],
  });

  if (isSuccess) { }
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

  if (isError) return <div>Error fetching food list.</div>;
  if (isLoading) return <Spinner />;

  return (
    <>
      {!food || food.length === 0 ? (

        <Alert className="mt-10 w-5/6 mx-auto bg-red-100">
          <AlertDescription className="flex items-center justify-center gap-x-2 text-xl text-gray-700 max-sm:text-sm">
            <Info /> {query ? "No matching foods found." : "No food available in this category, please try another category."}
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid max-[375px]:grid-cols-1 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-6 max-w-[90%] mx-auto">
          {food?.map((food: Food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      )}
    </>
  );
};

export default FoodList;
