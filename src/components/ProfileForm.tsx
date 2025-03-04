import { useAuth } from "@/contexts/AuthContext";
import { UserProfile } from "./Types/Types";
import { useEffect } from "react";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoadingButton } from "./ui/LoadingButton";
import { MutationStatus } from "@/utils/Enums";

type ProfileFormProps = {
  profileData?: Omit<UserProfile, "id">;
  onSubmit: (
    data: Omit<UserProfile, "id"> & { userId: number | undefined }
  ) => void;
  status: MutationStatus;
};

const ProfileForm: React.FC<ProfileFormProps> = ({
  profileData,
  onSubmit,
  status,
}) => {
  const { user } = useAuth();

  const schema = zod.object({
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

  type formFields = zod.infer<typeof schema>;

  const resolver = zodResolver(schema);

  const defaultFromValues = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    city: "",
    address: "",
    postCode: "",
    country: "",
  };

  const methods = useForm<formFields>({
    defaultValues: user?.isProfileComplete ? profileData : defaultFromValues,
    resolver: resolver,
    mode: "onChange",
  });

  const {
    register,
    trigger,
    reset,
    handleSubmit,
    formState: { errors, isValid },
  } = methods;

  useEffect(() => {
    if (profileData) {
      reset(profileData);
    }
  }, [profileData]);

  const isPending = status === MutationStatus.Pending ? true : false;

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit({ ...data, userId: user?.id }))}
    >
      <div className="flex flex-col space-y-4 p-4">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <div className="flex flex-col space-y-2">
          <label htmlFor="firstName" className="font-semibold">
            First Name
          </label>
          <input
            {...register("firstName", {
              onChange: () => trigger("firstName"),
            })}
            type="text"
            id="firstName"
            name="firstName"
            placeholder="First Name"
            className="p-2 border-[1px] border-gray-300 rounded-md outline-none"
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm ">{errors.firstName.message}</p>
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="lastName" className="font-semibold">
            Last Name
          </label>
          <input
            {...register("lastName")}
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Last Name"
            className="p-2 border-[1px] border-gray-300 rounded-md outline-none"
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm ">{errors.lastName.message}</p>
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="phoneNumber" className="font-semibold">
            Phone Number
          </label>
          <input
            {...register("phoneNumber")}
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            placeholder="Phone Number"
            className="p-2 border-[1px] border-gray-300 rounded-md outline-none"
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm ">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="address" className="font-semibold">
            Address
          </label>
          <input
            {...register("address")}
            type="text"
            id="address"
            name="address"
            placeholder="Address"
            className="p-2 border-[1px] border-gray-300 rounded-md outline-none"
          />
          {errors.address && (
            <p className="text-red-500 text-sm ">{errors.address.message}</p>
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="city" className="font-semibold">
            City
          </label>
          <input
            {...register("city")}
            type="text"
            id="city"
            name="city"
            placeholder="City"
            className="p-2 border-[1px] border-gray-300 rounded-md outline-none"
          />
          {errors.city && (
            <p className="text-red-500 text-sm ">{errors.city.message}</p>
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="postCode" className="font-semibold">
            Post Code
          </label>
          <input
            {...register("postCode")}
            type="text"
            id="postCode"
            name="postCode"
            placeholder="Post Code"
            className="p-2 border-[1px] border-gray-300 rounded-md outline-none"
          />
          {errors.postCode && (
            <p className="text-red-500 text-sm ">{errors.postCode.message}</p>
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="country" className="font-semibold">
            Country
          </label>
          <input
            {...register("country")}
            type="text"
            id="country"
            name="country"
            placeholder="country"
            className="p-2 border-[1px] border-gray-300 rounded-md outline-none"
          />
          {errors.country && (
            <p className="text-red-500 text-sm ">{errors.country.message}</p>
          )}
        </div>
        <LoadingButton
          loading={isPending}
          disabled={!isValid}
          type="submit"
          className={`bg-black text-white p-2 rounded-md hover:opacity-80 ${
            !isValid ? "cursor-not-allowed bg-gray-500" : "cursor-pointer"
          }`}
        >
          {user?.isProfileComplete
            ? "Update Profile Info"
            : "Save Profile Info"}
        </LoadingButton>
      </div>
    </form>
  );
};
export default ProfileForm;
