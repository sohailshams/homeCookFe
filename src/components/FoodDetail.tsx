import { fetchFoodDetail } from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import { ChevronsDownUp, CircleMinus, CirclePlus, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
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
import {
  decrementFoodQuantity,
  formatDate,
  incrementFoodQuantity,
} from "@/utils/utils";
import { Button } from "./ui/button";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Food } from "./Types/Types";

const FoodDetail: React.FC = () => {
  const navigate = useNavigate();
  const { foodId } = useParams<{ foodId: string }>();
  const {
    data: food,
    isLoading,
    isError,
  } = useQuery<Food & { ingredients: string[] }>({
    queryFn: () => fetchFoodDetail(foodId),
    queryKey: [foodId],
  });

  const disabled = (food?.quantityAvailable ?? 0) === 0;

  const schema = zod.object({
    foodQuantity: zod.coerce
      .number({
        required_error: "Quantity is missing.",
      })
      .min(1, { message: "Quantity must be at least 1." })
      .max(food?.quantityAvailable ?? 0, {
        message: `Quantity must be less than or equal to ${
          food?.quantityAvailable ?? 0
        }.`,
      })
      .int({
        message: "Please add an integer.",
      }),
  });

  type formFields = zod.infer<typeof schema>;

  const resolver = zodResolver(schema);

  const methods = useForm<formFields>({
    defaultValues: { foodQuantity: 1 },
    resolver,
    mode: "onChange",
  });

  const {
    register,
    watch,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = methods;

  const handleOrder = () => {
    if (!isValid) return;
    navigate("/checkoutContainer", {
      state: {
        foodId: foodId,
        quantity: watch("foodQuantity"),
        price: food?.price,
        name: food?.name,
        quantityAvailable: food?.quantityAvailable,
      },
    });
  };

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
          {food?.foodImageUrls.map((img: string, index: number) => (
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
        <h1 className="text-2xl font-bold">{food?.name}</h1>
        <p className="py-1">{food?.description}</p>
        <Collapsible className="my-2">
          <CollapsibleTrigger className="flex items-center justify-between">
            <span className="font-semibold text-lg">Ingredients</span>
            <ChevronsDownUp className="h-5" />
          </CollapsibleTrigger>
          <CollapsibleContent className="grid grid-cols-2 gap-2">
            {food?.ingredients?.map((ingredient: string, index: number) => (
              <p key={index} className="my-2 py-1 pl-1 max-w-56 shadow-lg">
                {ingredient}
              </p>
            ))}
          </CollapsibleContent>
        </Collapsible>
        <p>
          <span className="text-lg font-semibold">Price:</span> £{food?.price}
        </p>
        {food && food.quantityAvailable > 0 ? (
          <>
            <form className="my-2">
              <label className="font-semibold">Select Quantity:</label>
              <div className="flex items-center space-x-2">
                <CircleMinus
                  className="cursor-pointer"
                  onClick={() =>
                    decrementFoodQuantity(
                      Number(watch("foodQuantity")),
                      setValue,
                      trigger,
                      "foodQuantity"
                    )
                  }
                />
                <input
                  type="number"
                  {...register("foodQuantity")}
                  className={`w-10 outline-none text-center border-[1px] [&::-webkit-inner-spin-button]:appearance-none ${
                    errors.foodQuantity ? "border-red-500" : "border-gray-300"
                  }  rounded px-2 py-1 w-16 ml-2 outline-none`}
                />
                <CirclePlus
                  className="cursor-pointer"
                  onClick={() =>
                    incrementFoodQuantity(
                      Number(watch("foodQuantity")),
                      setValue,
                      trigger,
                      "foodQuantity"
                    )
                  }
                />
              </div>
              {errors.foodQuantity && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.foodQuantity.message}
                </p>
              )}
            </form>
            <p>
              <span className="font-semibold">Available on:</span>{" "}
              {formatDate(food?.availableDate)}
            </p>
            <p>
              <span className="font-semibold">Max Order:</span>{" "}
              {food?.quantityAvailable}
            </p>
          </>
        ) : (
          <p className="font-semibold">Sold Out</p>
        )}
        <Button
          disabled={!isValid || disabled}
          onClick={handleOrder}
          size="lg"
          variant="outline"
          className="shadow-lg bg-gray-700 text-white mt-3"
        >
          Order
        </Button>
      </div>
    </div>
  );
};
export default FoodDetail;
