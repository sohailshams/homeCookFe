import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "./ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/api/api";
import { Category } from "./Types/Types";
import { toast } from "sonner";
import { X } from "lucide-react";

const Categories: React.FC = () => {
  const {
    data: categories,
    isError,
    isLoading,
  } = useQuery({
    queryFn: () => fetchCategories(),
    queryKey: ["categories"],
  });

  if (isError) {
    toast.error("Error fetching categories from database.", {
      duration: Infinity,
      action: {
        label: <X />,
        onClick: () => toast.dismiss(),
      },
      id: "categories-fetching-error-toast",
    });
  }

  if (isError || isLoading) return null;

  return (
    <Carousel className="w-[90%]  mx-auto pt-2  px-4">
      <CarouselContent className="-ml-1">
        {categories?.map((category: Category, index: number) => (
          <CarouselItem
            key={index}
            className="pl-1 max-[400px]:basis-[50%] max-[550px]:basis-[35%] max-sm:basis-[25%] sm:basis-[20%] md:basis-[15%] lg:basis-[10%]"
          >
            <Card className="p-1 shadow-lg max-w-28 max-h-24 mx-auto border-gray-400 cursor-pointer">
              <CardContent className="flex aspect-square items-center justify-center pt-2">
                <span className="text-sm text-center">{category.name}</span>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="ml-2" />
      <CarouselNext className="mr-2" />
    </Carousel>
  );
};
export default Categories;
