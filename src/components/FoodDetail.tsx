import { fetchFoodDetail } from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import { ChevronsDownUp, X } from "lucide-react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import Spinner from "./Spinner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { CardContent } from "./ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

const FoodDetail: React.FC = () => {
  const { foodId } = useParams<{ foodId: string }>();
  const {
    data: food,
    isLoading,
    isError,
  } = useQuery({
    queryFn: () => fetchFoodDetail(foodId),
    queryKey: [foodId],
  });

  if (isError) {
    toast.error("Error fetching food detail from database.", {
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
    <div className="my-6 max-w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
      <Carousel className="w-full">
        <CarouselContent>
          {food.foodImageUrls.map((img: string, index: number) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <CardContent className="p-0">
                  <div className="relative w-full min-h-96 max-h-full aspect-[16/9] overflow-hidden">
                    <img
                      src={img}
                      alt={food.name}
                      className="w-full h-full object-cover object-center"
                    />
                    <CarouselPrevious className="absolute max-sm:left-2 left-4 bg-black/50 text-white hover:bg-black/70" />
                    <CarouselNext className="absolute max-sm:right-2 right-4 top-1/2  bg-black/50 text-white hover:bg-black/70" />
                  </div>
                </CardContent>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="ml-2 text-gray-700 ">
        <h1 className="text-2xl font-bold">{food.name}</h1>
        <p>{food.description}</p>
        <Collapsible className="my-2">
          <CollapsibleTrigger className="flex items-center justify-between">
            <span className="font-semibold text-lg">Ingredients</span>
            <ChevronsDownUp />
          </CollapsibleTrigger>
          <CollapsibleContent>
            {food.ingredients.map((ingredient: string, index: number) => (
              <p key={index} className="my-2 py-1 pl-1 max-w-56 shadow-lg">
                {ingredient}
              </p>
            ))}
          </CollapsibleContent>
        </Collapsible>
        <p className="text-lg font-semibold">£{food.price}</p>
        <p>Available on: {food.availableDate}</p>
        <p>Max Order: {food.quantityAvailable} Portions</p>
      </div>
    </div>
  );
};
export default FoodDetail;
