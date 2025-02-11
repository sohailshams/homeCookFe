import { useAuth } from "@/contexts/AuthContext";
import { CircleMinus, CirclePlus } from "lucide-react";
import { useLocation } from "react-router-dom";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { UserProfile } from "./Types/Types";
import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile } from "@/api/api";
import Spinner from "./Spinner";
import ProfileForm from "./ProfileForm";

type LocationState = {
  foodId: string;
  quantity: number;
  price: number;
  name: string;
  quantityAvailable: number;
};

const Checkout: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { foodId, quantity, price, name, quantityAvailable } =
    (location.state as LocationState) || {};

  const {
    data: profileData,
    isLoading,
    isError,
  } = useQuery<UserProfile>({
    queryFn: () => fetchUserProfile(user?.id),
    queryKey: ["userProfile"],
    enabled: !!user?.isProfileComplete,
  });

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

  const handleProfileSubmit = async (data: Omit<UserProfile, "id">) => {
    console.log("Profile Form Submitted", data);
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="flex my-6 max-w-[90%] mx-auto flex-col lg:flex-row text-gray-700">
      <div className="w-full lg:w-3/5 grow">
        <ProfileForm profileData={profileData} onSubmit={handleProfileSubmit} />
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
