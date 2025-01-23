import { formatDate } from "@/utils/utils";
import { Food } from "./Types/Types";
import { Link } from "react-router-dom";

interface FoodCardProps {
  food: Food;
}

const FoodCard: React.FC<FoodCardProps> = ({ food }) => {
  return (
    <Link
      to={`/food/${food.id}`}
      className="bg-white shadow-lg rounded-lg overflow-hidden max-w-64 max-[375px]:mx-auto cursor-pointer"
    >
      <img
        src={food.foodImageUrls[0]}
        alt={food.name}
        className="w-full h-56 object-cover object-center"
      />
      <div className="p-4">
        <h1 className="text-gray-900 font-medium text-lg">{food.name}</h1>
        <div className=" mt-3">
          <h1 className="text-gray-700 font-bold">£{food.price}</h1>
          <p className="">Available on: {formatDate(food.availableDate)}</p>
          <p>Max Order: {food.quantityAvailable} Portions</p>
        </div>
      </div>
    </Link>
  );
};
export default FoodCard;
