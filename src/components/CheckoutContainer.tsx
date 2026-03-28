import { createPaymentIntent } from "@/api/api";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Info, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import Checkout from "./Checkout";
import { Alert, AlertDescription } from "./ui/alert";
import Spinner from "./Spinner";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
type LocationState = {
  foodId: string;
  quantity: number;
  price: number;
  name: string;
  quantityAvailable: number;
};

const CheckoutContainer: React.FC = () => {
  const location = useLocation();
  const { foodId, quantity, price, name, quantityAvailable } =
    (location.state as LocationState) || {};
  const [itemQuantity, setItemQuantity] = useState<number>(quantity);

  const {
    mutate: createPaymentIntentMutation,
    data,
    isPending,
    isError,
  } = useMutation({
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
  });

  useEffect(() => {
    createPaymentIntentMutation({
      Amount: price * itemQuantity,
      Quantity: itemQuantity,
      FoodId: foodId,
    });
  }, [itemQuantity]);

  const stripeOptions = useMemo((): StripeElementsOptions | undefined => {
    return {
      mode: "payment",
      currency: "gbp",
      amount: itemQuantity * price * 100,
    };
  }, [itemQuantity, price]);

  if (!stripeOptions || !stripePromise) return null;

  if (isPending) {
    return <Spinner />;
  }

  if (isError) {
    <Alert className="mt-10 w-5/6 mx-auto bg-red-100">
      <AlertDescription className="flex items-center justify-center gap-x-2 text-xl text-gray-700 max-sm:text-sm">
        <Info /> Failed to initialise payment, please try again.
      </AlertDescription>
    </Alert>;
  }

  return (
    <Elements stripe={stripePromise} options={stripeOptions}>
      <Checkout
        itemQuantity={itemQuantity}
        setItemQuantity={setItemQuantity}
        price={price}
        name={name}
        quantityAvailable={quantityAvailable}
        clientSecret={data?.clientSecret}
      />
    </Elements>
  );
};

export default CheckoutContainer;
