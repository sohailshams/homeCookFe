import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useState } from "react";
import { Card, CardContent } from "./ui/card";

const Categories = () => {
  const [categories, setCategories] = useState([
    "Asian",
    "American",
    "Italian",
    "Mexican",
    "Indian",
    "Chinese",
    "Japanese",
    "Korean",
    "Thai",
    "Vietnamese",
  ]);
  return (
    <Carousel className="w-[90%]  mx-auto pt-2  px-4">
      <CarouselContent className="-ml-1">
        {categories.map((category, index) => (
          <CarouselItem
            key={index}
            className="pl-1 sm:basis-1/3 md:basis-1/4 lg:basis-1/6"
          >
            <Card className="p-1 shadow-lg max-w-44 max-h-44 mx-auto border-gray-400">
              <CardContent className="flex aspect-square items-center justify-center p-2">
                <span className="text-sm">{category}</span>
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
