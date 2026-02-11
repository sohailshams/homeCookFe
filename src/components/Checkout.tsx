import { useAuth } from "@/contexts/AuthContext";
import { CircleMinus, CirclePlus, X } from "lucide-react";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { UserProfile } from "./Types/Types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { addProfile, fetchUserProfile, updateProfile } from "@/api/api";
import Spinner from "./Spinner";
import Profile from "./Profile";
import { toast } from "sonner";
import { MutationStatus } from "@/utils/Enums";
import { decrementFoodQuantity, incrementFoodQuantity } from "@/utils/utils";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Field, FieldGroup } from "./ui/field";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type CheckoutProps = {
  itemQuantity: number;
  setItemQuantity: (value: number) => void;
  price: number;
  name: string;
  quantityAvailable: number;
  clientSecret: string;
};

const Checkout: React.FC<CheckoutProps> = ({
  itemQuantity,
  setItemQuantity,
  price,
  name,
  quantityAvailable,
  clientSecret,
}) => {
  const { user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();

  // const {
  //   data: profileData,
  //   isLoading,
  //   isError,
  // } = useQuery<UserProfile>({
  //   queryFn: () => fetchUserProfile(user?.id),
  //   queryKey: ["userProfile"],
  //   enabled: !!user?.isProfileComplete,
  // });

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
    defaultValues: { foodQuantity: itemQuantity },
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

  const {
    data: profileData,
    isLoading,
    isError,
  } = useQuery<UserProfile>({
    queryFn: () => fetchUserProfile(user?.id),
    queryKey: ["userProfile"],
    enabled: !!user && user?.isProfileComplete,
  });

  // const { mutate: addUpdateProfileMutation, status } = useMutation({
  //   mutationFn: user?.isProfileComplete ? updateProfile : addProfile,
  //   onError: (err: AxiosError) => {
  //     if (err) {
  //       toast.error("Failed to save profile information, please try again", {
  //         duration: Infinity,
  //         action: {
  //           label: <X />,
  //           onClick: () => toast.dismiss(),
  //         },
  //         id: "profileSave-fail-toast",
  //       });
  //     }
  //   },
  //   onSuccess: async () => {
  //     toast.success("Profile updated successfully.");
  //   },
  // });

  // const handleProfileSubmit = async (
  //   data: Omit<UserProfile, "id"> & { userId: number | undefined }
  // ) => {
  //   if (isValid) {
  //     addUpdateProfileMutation(data);
  //   }
  // };

  // if (isLoading) return <Spinner />;
  // if (isError) {
  //   toast.error("Failed to load profile information, please try again", {
  //     duration: Infinity,
  //     action: {
  //       label: <X />,
  //       onClick: () => toast.dismiss(),
  //     },
  //     id: "getProfile-fail-toast",
  //   });
  // }

  const handlePayment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      toast.error(submitError.message, {
        duration: Infinity,
        action: {
          label: <X />,
          onClick: () => toast.dismiss(),
        },
        id: "paymentProcess-fail-toast",
      });
    }
    // Remember to update the return_url in production;
    // Also update the BE to store the order and fetch it in success page
    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `http://localhost:5173/payment-success`,
      },
    });

    if (error) {
      toast.error(error.message, {
        duration: Infinity,
        action: {
          label: <X />,
          onClick: () => toast.dismiss(),
        },
        id: "payment-error-toast",
      });
    }
  };

  return (
    <div className="flex my-6 max-w-[90%] mx-auto flex-col lg:flex-row text-gray-700">
      <div className="w-full lg:w-3/5 grow">
        <h1 className="text-4xl font-bold">CheckOut</h1>
        <Card className="my-4 p-4">
          <p className="my-4 text-xl font-bold">My Informarion</p>
          <div>
            <p>
              {profileData?.firstName} {profileData?.lastName}
            </p>
            <p>{user?.userName}</p>
          </div>
          <div>
            <p className="my-4 text-xl font-bold">Delivery Address</p>
            <p>{profileData?.addressLine1}</p>
            <p>{profileData?.city}</p>
            <p>{profileData?.postCode}</p>
            <p>{profileData?.city}</p>
            <p>{profileData?.country}</p>
          </div>
          <Dialog>
            <form>
              <DialogTrigger asChild>
                <Button variant="outline" className="border border-black mt-2">
                  Edit Delivery Address
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle>Edit Delivery Address</DialogTitle>
                  <DialogDescription>
                    Make changes to your delivery address here. Click save when
                    you&apos;re done.
                  </DialogDescription>
                </DialogHeader>
                <FieldGroup>
                  <Field>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      defaultValue={profileData?.addressLine1}
                    />
                  </Field>
                  <Field>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      defaultValue={profileData?.city}
                    />
                  </Field>
                  <Field>
                    <Label htmlFor="postCode">Post Code</Label>
                    <Input
                      id="postCode"
                      name="postCode"
                      defaultValue={profileData?.postCode}
                    />
                  </Field>
                  <Field>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      defaultValue={profileData?.country}
                    />
                  </Field>
                </FieldGroup>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </form>
          </Dialog>
        </Card>
      </div>
      <div className="w-full lg:w-2/5 flex-none text-gray-700">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Order Summary</h1>
          <div className="flex justify-between my-2">
            <p>{name}</p>
            <div className="flex items-center space-x-2">
              <CircleMinus
                className="cursor-pointer"
                onClick={() => {
                  decrementFoodQuantity(
                    Number(watch("foodQuantity")),
                    setValue,
                    trigger,
                    "foodQuantity",
                  );
                  setItemQuantity(Number(watch("foodQuantity")));
                }}
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
                onClick={() => {
                  incrementFoodQuantity(
                    Number(watch("foodQuantity")),
                    setValue,
                    trigger,
                    "foodQuantity",
                  );
                  setItemQuantity(Number(watch("foodQuantity")));
                }}
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
          <form onSubmit={handlePayment} className="mt-4">
            {/* {!stripe || !clientSecret ? <Spinner /> : <PaymentElement />} */}
            <PaymentElement />
            <button
              type="submit"
              disabled={!isValid}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md disabled:opacity-50"
            >
              Pay Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Checkout;
