import { Food } from "./Types/Types";

interface FoodCardProps {
  food: Food;
}

const FoodCard: React.FC<FoodCardProps> = ({ food }) => {
  console.log("image", food.foodImageUrls[0]);
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-64">
      <img
        src={food.foodImageUrls[0]}
        alt={food.name}
        className="w-full h-56 object-cover object-center"
      />
      <div className="p-4">
        <h1 className="text-gray-900 font-medium text-lg">{food.name}</h1>
        <div className=" mt-3">
          <h1 className="text-gray-700 font-bold">£{food.price}</h1>
          <p className="">Available on: 28-01-2025</p>
          <p>Max Order: {food.quantityAvailable} Portions</p>
        </div>
      </div>
    </div>
  );
};
export default FoodCard;
