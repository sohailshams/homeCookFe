import { useAuth } from "@/contexts/AuthContext";
import { CircleMinus, CirclePlus } from "lucide-react";
import { useLocation } from "react-router-dom";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

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

  const profileSchema = zod.object({
    firstName: zod.string().min(2, { message: "First name is required." }),
    lastName: zod.string().min(2, { message: "Last name is required." }),
    phoneNumber: zod.coerce
      .string()
      .min(2, { message: "Phone number is required." }),
    city: zod.string().min(2, { message: "City is required." }),
    address: zod.string().min(2, { message: "Address is required." }),
    postCode: zod.string().min(2, { message: "Post code is required." }),
    country: zod.string().min(2, { message: "Country is required." }),
  });

  type profileFormFields = zod.infer<typeof profileSchema>;

  const profileResolver = zodResolver(profileSchema);

  const profileFormmethods = useForm<profileFormFields>({
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      city: "",
      address: "",
      postCode: "",
      country: "",
    },
    resolver: profileResolver,
    mode: "onChange",
  });

  const {
    register: profileRegister,
    watch: profileWatch,
    setValue: profileSetValue,
    trigger: profileTrigger,
    handleSubmit,
    formState: { errors: profileErrors, isValid: profileIsValid },
  } = profileFormmethods;

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
  const onSubmit: SubmitHandler<any> = async (data) => {
    console.log(data);
  };
  return (
    <div className="flex my-6 max-w-[90%] mx-auto flex-col lg:flex-row">
      <div className="w-full lg:w-3/5 grow">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col space-y-4 p-4">
            <h1 className="text-2xl font-bold text-gray-700">Checkout</h1>
            <div className="flex flex-col space-y-2">
              <label htmlFor="firstName" className="hidden">
                First Name
              </label>
              <input
                {...profileRegister("firstName", {
                  onChange: () => profileTrigger("firstName"),
                })}
                type="text"
                id="firstName"
                name="firstName"
                placeholder="First Name"
                className="p-2 border-[1px] border-gray-300 rounded-md outline-none"
              />
              {profileErrors.firstName && (
                <p className="text-red-500 text-sm ">
                  {profileErrors.firstName.message}
                </p>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="lastName" className="hidden">
                Last Name
              </label>
              <input
                {...profileRegister("lastName")}
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Last Name"
                className="p-2 border-[1px] border-gray-300 rounded-md outline-none"
              />
              {profileErrors.lastName && (
                <p className="text-red-500 text-sm ">
                  {profileErrors.lastName.message}
                </p>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="phoneNumber" className="hidden">
                Phone Number
              </label>
              <input
                {...profileRegister("phoneNumber")}
                type="number"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Phone Number"
                className="p-2 border-[1px] border-gray-300 rounded-md outline-none"
              />
              {profileErrors.phoneNumber && (
                <p className="text-red-500 text-sm ">
                  {profileErrors.phoneNumber.message}
                </p>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="address" className="hidden">
                Address
              </label>
              <input
                {...profileRegister("address")}
                type="text"
                id="address"
                name="address"
                placeholder="Address"
                className="p-2 border-[1px] border-gray-300 rounded-md outline-none"
              />
              {profileErrors.address && (
                <p className="text-red-500 text-sm ">
                  {profileErrors.address.message}
                </p>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="city" className="hidden">
                City
              </label>
              <input
                {...profileRegister("city")}
                type="text"
                id="city"
                name="city"
                placeholder="City"
                className="p-2 border-[1px] border-gray-300 rounded-md outline-none"
              />
              {profileErrors.city && (
                <p className="text-red-500 text-sm ">
                  {profileErrors.city.message}
                </p>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="postCode" className="hidden">
                Post Code
              </label>
              <input
                {...profileRegister("postCode")}
                type="text"
                id="postCode"
                name="postCode"
                placeholder="Post Code"
                className="p-2 border-[1px] border-gray-300 rounded-md outline-none"
              />
              {profileErrors.postCode && (
                <p className="text-red-500 text-sm ">
                  {profileErrors.postCode.message}
                </p>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="country" className="hidden">
                Country
              </label>
              <input
                {...profileRegister("country")}
                type="text"
                id="country"
                name="country"
                placeholder="country"
                className="p-2 border-[1px] border-gray-300 rounded-md outline-none"
              />
              {profileErrors.country && (
                <p className="text-red-500 text-sm ">
                  {profileErrors.country.message}
                </p>
              )}
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
