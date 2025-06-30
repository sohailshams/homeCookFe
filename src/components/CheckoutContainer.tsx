import { createPaymentIntent } from "@/api/api";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import Checkout from "./Checkout";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
type LocationState = {
  foodId: string;
  quantity: number;
  price: number;
  name: string;
  quantityAvailable: number;
};

const CheckoutContainer: React.FC = () => {
  const [clientSecret, setClientSecret] = useState<string>("");
  const location = useLocation();
  const { foodId, quantity, price, name, quantityAvailable } =
    (location.state as LocationState) || {};
  const [itemQuantity, setItemQuantity] = useState<number>(quantity);

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
  });

  useEffect(() => {
    createPaymentIntentMutation({
      Amount: price * itemQuantity,
      Quantity: itemQuantity,
      FoodId: foodId,
    });
  }, [itemQuantity, setItemQuantity]);

  useEffect(() => {
    if (data?.clientSecret && !clientSecret) {
      setClientSecret(data.clientSecret);
    }
  }, [data?.clientSecret, clientSecret]);

  const stripeOptions = useMemo((): StripeElementsOptions | undefined => {
    return {
      mode: "payment",
      currency: "gbp",
      amount: itemQuantity * price,
    };
  }, [clientSecret]);

  if (!stripeOptions || !stripePromise) return null;

  return (
    <Elements stripe={stripePromise} options={stripeOptions}>
      <Checkout
        itemQuantity={itemQuantity}
        setItemQuantity={setItemQuantity}
        price={price}
        name={name}
        quantityAvailable={quantityAvailable}
        clientSecret={clientSecret}
      />
    </Elements>
  );
};
export default CheckoutContainer;
