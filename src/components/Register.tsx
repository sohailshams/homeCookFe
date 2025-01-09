import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "@/api/api";

export const schema = zod.object({
  email: zod
    .string()
    .email({ message: "Please enter a valid email address." })
    .max(30, { message: "Email address is too long." }),
  password: zod
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .refine((value) => /[A-Z]/.test(value), {
      message: "Passwords must have at least one uppercase letter ('A'-'Z').",
    })
    .refine((value) => /[a-z]/.test(value), {
      message: "Passwords must have at least one lower letter ('a'-'z').",
    })
    .refine((value) => /[0-9]/.test(value), {
      message: "Passwords must have at least one digit ('0'-'9').",
    })
    .refine((value) => /[^a-zA-Z0-9\s]/.test(value), {
      message: "Passwords must have at least one non-alphanumeric character.",
    }),
});

export type formFields = zod.infer<typeof schema>;

const Register: React.FC = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const resolver = zodResolver(schema);

  const methods = useForm<formFields>({
    defaultValues: { email: "", password: "" },
    resolver,
    mode: "onChange",
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = methods;

  const { mutate: registerMutation, status } = useMutation({
    mutationFn: registerUser,
    onError: () => {
      setErrorMessage("Failed to register, please try again");
      setDialogOpen(true);
    },

    onSuccess: async () => {
      setDialogOpen(false);
    },
  });

  const onSubmit: SubmitHandler<formFields> = (data) => {
    if (isValid) {
      registerMutation(data);
    }
  };

  return (
    <>
      <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogTrigger className="text-blue-500 font-semibold pl-2">
          register
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create your account</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                <form id="register-fom" onSubmit={handleSubmit(onSubmit)}>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    placeholder="example@example.com"
                    className={`w-full px-3 py-2 border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
                    {...register("email")}
                  />
                  {errors.email?.message && (
                    <p className="text-red-500">{errors.email?.message}</p>
                  )}
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mt-2"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className={`w-full px-3 py-2 border ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
                    {...register("password")}
                  />
                  {errors.password?.message && (
                    <p className="text-red-500">{errors.password?.message}</p>
                  )}
                  {/* <input type="submit" /> */}
                </form>
              </div>
            </AlertDialogDescription>
            {errorMessage && (
              <div className="bg-red-200 py-2 pl-2 text-sm ">
                {errorMessage}
              </div>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <button
              disabled={!isValid}
              form="register-fom"
              type="submit"
              className={`text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 px-2 ${
                !isValid ? "cursor-not-allowed" : ""
              }`}
            >
              {status === "pending" ? <p>Registering...</p> : <p>Register</p>}
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
export default Register;
