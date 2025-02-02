import { useAuth } from "@/contexts/AuthContext";
import { CircleMinus, CirclePlus } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type LocationState = {
  foodId: string;
  quantity: number;
  price: number;
  name: string;
  quantityAvailable: number;
};

const Checkout: React.FC = () => {
  const location = useLocation();
  const { foodId, quantity, price, name, quantityAvailable } =
    (location.state as LocationState) || {};
  //   const [foodQuantity, setFoodQuantity] = useState<number>(Number(quantity));
  const { user } = useAuth();

  const schema = zod.object({
    foodQuantity: zod.coerce
      .number({
        required_error: "Quantity is missing.",
      })
      .min(1, { message: "Quantity must be at least 1." })
      .max(quantityAvailable ?? 0, {
        message: `Quantity must be less than or equal to ${
          quantityAvailable ?? 0
        }.`,
      })
      .int({
        message: "Please add an integer.",
      }),
  });

  type formFields = zod.infer<typeof schema>;

  const resolver = zodResolver(schema);

  const methods = useForm<formFields>({
    defaultValues: { foodQuantity: quantity },
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

  const increment = () => {
    const currentQuantity = Number(watch("foodQuantity"));
    setValue("foodQuantity", currentQuantity + 1);
    trigger("foodQuantity");
  };

  const decrement = () => {
    const currentQuantity = Number(watch("foodQuantity"));
    setValue("foodQuantity", currentQuantity - 1);
    trigger("foodQuantity");
  };

  return (
    <div className="flex my-6 max-w-[90%] mx-auto flex-col lg:flex-row">
      <div className="w-full lg:w-3/5 grow">
        <form>
          <div className="flex flex-col space-y-4 p-4">
            <h1 className="text-2xl font-bold text-gray-700">Checkout</h1>
            <div className="flex flex-col space-y-2">
              <label htmlFor="first-name" className="hidden">
                First Name
              </label>
              <input
                type="text"
                id="first-name"
                name="first-name"
                placeholder="First Name"
                required
                className="p-2 border-[1px] border-gray-300 rounded-md outline-none"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="last-name" className="hidden">
                Last Name
              </label>
              <input
                type="text"
                id="last-name"
                name="last-name"
                placeholder="Last Name"
                required
                className="p-2 border-[1px] border-gray-300 rounded-md outline-none"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="email" className="hidden">
                Phone Number
              </label>
              <input
                type="phone-number"
                id="phone-number"
                name="email"
                placeholder="Phone Number"
                required
                className="p-2 border-[1px] border-gray-300 rounded-md outline-none"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="address" className="hidden">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                placeholder="Address"
                required
                className="p-2 border-[1px] border-gray-300 rounded-md outline-none"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="quantity" className="hidden">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                placeholder="City"
                required
                className="p-2 border-[1px] border-gray-300 rounded-md outline-none"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="price" className="hidden">
                Post Code
              </label>
              <input
                type="text"
                id="post-code"
                name="post-code"
                placeholder="Post Code"
                required
                className="p-2 border-[1px] border-gray-300 rounded-md outline-none"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="price" className="hidden">
                Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                placeholder="country"
                required
                className="p-2 border-[1px] border-gray-300 rounded-md outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-black text-white p-2 rounded-md"
            >
              {user?.isProfileComplete
                ? "Update Profile Info"
                : "Save Profile Info"}
            </button>
          </div>
        </form>
      </div>
      <div className="w-full lg:w-2/5 flex-none text-gray-700">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Order Summary</h1>
          <div className="flex justify-between my-2">
            <p>{name}</p>
            <div className="flex items-center space-x-2">
              <CircleMinus className="cursor-pointer" onClick={decrement} />
              <input
                className={`w-10 outline-none border-[1px] border-gray-300 [&::-webkit-inner-spin-button]:appearance-none text-center  ${
                  errors.foodQuantity ? "border-red-500" : "border-gray-300"
                }`}
                type="number"
                {...register("foodQuantity")}
              />
              <CirclePlus className="cursor-pointer" onClick={increment} />
            </div>
            <p>£{price}</p>
          </div>
          {errors.foodQuantity && (
            <p className="text-red-500 text-sm mt-1 text-center">
              {errors.foodQuantity.message}
            </p>
          )}
          <div className="flex justify-between my-2">
            <p>Total</p>
            <p>£{price * watch("foodQuantity")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Checkout;
