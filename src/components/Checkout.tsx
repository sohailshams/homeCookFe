import { useAuth } from "@/contexts/AuthContext";
import { CircleMinus, CirclePlus, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { UserProfile } from "./Types/Types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  addProfile,
  createPaymentIntent,
  fetchUserProfile,
  updateProfile,
} from "@/api/api";
import Spinner from "./Spinner";
import ProfileForm from "./ProfileForm";
import { toast } from "sonner";
import { MutationStatus } from "@/utils/Enums";
import { decrementFoodQuantity, incrementFoodQuantity } from "@/utils/utils";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";

type LocationState = {
  foodId: string;
  quantity: number;
  price: number;
  name: string;
  quantityAvailable: number;
};

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Checkout: React.FC = () => {
  const [clientSecret, setClientSecret] = useState("");
  const { user } = useAuth();
  const location = useLocation();
  const { quantity, price, name, quantityAvailable } =
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

  const { mutate: createPaymentIntentMutation, data } = useMutation({
    mutationFn: createPaymentIntent,
    onError: (err: AxiosError) => {
      if (err) {
        toast.error("Failed to create payment intent.", {
          duration: Infinity,
          action: {
            label: <X />,
            onClick: () => toast.dismiss(),
          },
          id: "paymentIntent-fail-toast",
        });
      }
    },

    onSuccess: async () => {
      toast.success("Payment successful.");
    },
  });

  useEffect(() => {
    createPaymentIntentMutation({
      Amount: 40,
    });
  }, []);

  useEffect(() => {
    setClientSecret(data?.clientSecret ?? "");
  }, [data]);

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

  const { mutate: addUpdateProfileMutation, status } = useMutation({
    mutationFn: user?.isProfileComplete ? updateProfile : addProfile,
    onError: (err: AxiosError) => {
      if (err) {
        toast.error("Failed to save profile informatoin, please try again", {
          duration: Infinity,
          action: {
            label: <X />,
            onClick: () => toast.dismiss(),
          },
          id: "profileSave-fail-toast",
        });
      }
    },

    onSuccess: async () => {
      toast.success("Profile updated successfully.");
    },
  });
  const handleProfileSubmit = async (
    data: Omit<UserProfile, "id"> & { userId: number | undefined }
  ) => {
    if (isValid) {
      addUpdateProfileMutation(data);
    }
  };

  if (isLoading) return <Spinner />;
  if (isError) {
    toast.error("Failed to load profile informatoin, please try again", {
      duration: Infinity,
      action: {
        label: <X />,
        onClick: () => toast.dismiss(),
      },
      id: "getProfile-fail-toast",
    });
  }

  if (!clientSecret || !stripePromise) return null;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <div className="flex my-6 max-w-[90%] mx-auto flex-col lg:flex-row text-gray-700">
        <div className="w-full lg:w-3/5 grow">
          <ProfileForm
            profileData={profileData}
            onSubmit={handleProfileSubmit}
            status={status as MutationStatus}
          />
        </div>
        <div className="w-full lg:w-2/5 flex-none text-gray-700">
          <div className="p-4">
            <h1 className="text-2xl font-bold">Order Summary</h1>
            <div className="flex justify-between my-2">
              <p>{name}</p>
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
                  className={`w-10 outline-none border-[1px] border-gray-300 [&::-webkit-inner-spin-button]:appearance-none text-center  ${
                    errors.foodQuantity ? "border-red-500" : "border-gray-300"
                  }`}
                  type="number"
                  {...register("foodQuantity")}
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
            <form className="mt-4">
              {clientSecret && <PaymentElement />}

              <button
                type="submit"
                // disabled={!stripe}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md disabled:opacity-50"
              >
                {/* {loading ? "Processing..." : "Pay Now"} */}
                Pay Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </Elements>
  );
};
export default Checkout;
