import { useAuth } from "@/contexts/AuthContext";
import { UserProfile } from "./Types/Types";
import { useEffect } from "react";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type ProfileFormProps = {
  profileData?: Omit<UserProfile, "id">;
  onSubmit: (data: Omit<UserProfile, "id">) => void;
};

const ProfileForm: React.FC<ProfileFormProps> = ({ profileData, onSubmit }) => {
  const { user } = useAuth();

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

  const defaultFromValues = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    city: "",
    address: "",
    postCode: "",
    country: "",
  };

  const profileFormmethods = useForm<profileFormFields>({
    defaultValues: user?.isProfileComplete ? profileData : defaultFromValues,
    resolver: profileResolver,
    mode: "onChange",
  });

  const {
    register: profileRegister,
    watch: profileWatch,
    setValue: profileSetValue,
    trigger: profileTrigger,
    reset,
    handleSubmit,
    formState: { errors: profileErrors, isValid: profileIsValid },
  } = profileFormmethods;

  useEffect(() => {
    if (profileData) {
      reset(profileData);
    }
  }, [profileData]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col space-y-4 p-4">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <div className="flex flex-col space-y-2">
          <label htmlFor="firstName" className="font-semibold">
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
          <label htmlFor="lastName" className="font-semibold">
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
          <label htmlFor="phoneNumber" className="font-semibold">
            Phone Number
          </label>
          <input
            {...profileRegister("phoneNumber")}
            type="text"
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
          <label htmlFor="address" className="font-semibold">
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
          <label htmlFor="city" className="font-semibold">
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
          <label htmlFor="postCode" className="font-semibold">
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
          <label htmlFor="country" className="font-semibold">
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
          disabled={!profileIsValid}
          type="submit"
          className={`bg-black text-white p-2 rounded-md ${
            !profileIsValid
              ? "cursor-not-allowed bg-gray-500"
              : "cursor-default"
          }`}
        >
          {user?.isProfileComplete
            ? "Update Profile Info"
            : "Save Profile Info"}
        </button>
      </div>
    </form>
  );
};
export default ProfileForm;
