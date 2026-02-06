import { useAuth } from "@/contexts/AuthContext";
import { UserProfile } from "./Types/Types";
import { useEffect } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, SubmitHandler } from "react-hook-form";
import { LoadingButton } from "./ui/LoadingButton";
import { MutationStatus } from "@/utils/Enums";
import { addProfile, fetchUserProfile, updateProfile } from "@/api/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { Info, X } from "lucide-react";
import Spinner from "./Spinner";
import { Alert, AlertDescription } from "./ui/alert";


const Profile: React.FC = () => {
  const { user } = useAuth();

    const { mutate: addUpdateProfileMutation, status } = useMutation({
    mutationFn: user?.isProfileComplete ? updateProfile : addProfile,
    onError: (err: AxiosError) => {
      if (err) {
        toast.error("Failed to save profile information, please try again.", {
          duration: 5000,
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
   const {
    data: profileData,
    isLoading,
    isError,
  } = useQuery<UserProfile>({
    queryFn: () => fetchUserProfile(user?.id),
    queryKey: ["userProfile"],
    enabled: !!user && user?.isProfileComplete,
  });

const schema = yup.object({
  firstName: yup.string().min(2, "First name is required.").required("First name is required."),
  lastName: yup.string().min(2, "Last name is required.").required("Last name is required."),
  phoneNumber: yup.string().required("Phone number is required."),
  city: yup.string().min(2, "City is required.").required("City is required."),
  addressLine1: yup.string().min(2, "Address is required.").required("Address is required."),
  postCode: yup.string().min(2, "Post code is required.").required("Post code is required."),
  country: yup.string().min(2, "Country is required.").required("Country is required."),
});
  type formFields = yup.InferType<typeof schema>;

  const resolver = yupResolver(schema);

  const methods = useForm<formFields>({
    defaultValues: {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    city: "",
    addressLine1: "",
    postCode: "",
    country: "",
  },
  resolver,
    mode: "onChange",
  });

  const {
    register,
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

    const onSubmit: SubmitHandler<formFields> = async (data: formFields) => {
      if (!user?.id) return;
      const userId = user.id;
    const payload: formFields & { userId: string } = {...data, userId};

    if (isValid) {
      addUpdateProfileMutation(payload);
    }
  };
if (isError) {
    return (
      <Alert className="mt-10 w-5/6 mx-auto bg-red-100">
        <AlertDescription className="flex items-center justify-center gap-x-2 text-xl text-gray-700 max-sm:text-sm">
          <Info /> Error fetching profile, please try later.
        </AlertDescription>
      </Alert>
    )
  }
  if (isLoading || isPending) return <Spinner />

  return (
    <div className="my-6 max-w-[60%] mx-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col space-y-4 p-4">
          <h1 className="text-2xl font-bold">Profile</h1>
          <div className="flex flex-col space-y-2">
            <label htmlFor="firstName" className="font-semibold">
              First Name
            </label>
            <input
              {...register("firstName")}
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
            <label htmlFor="addressLine1" className="font-semibold">
              Address
            </label>
            <input
              {...register("addressLine1")}
              type="text"
              id="addressLine1"
              name="addressLine1"
              placeholder="Address"
              className="p-2 border-[1px] border-gray-300 rounded-md outline-none"
            />
            {errors.addressLine1 && (
              <p className="text-red-500 text-sm ">{errors.addressLine1.message}</p>
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
    </div>
  );
};
export default Profile;
