import { useAuth } from "@/contexts/AuthContext";
import { CircleMinus, CirclePlus } from "lucide-react";
import { useLocation } from "react-router-dom";

const Checkout: React.FC = () => {
  const location = useLocation();
  const { foodId, quantity, price, name } = location.state || {};
  const { user } = useAuth();

  return (
    <div className="flex my-6 max-w-[90%] mx-auto flex-col lg:flex-row">
      <div className="w-full lg:w-3/5 grow">
        <form>
          <div className="flex flex-col space-y-4 p-4">
            <h1 className="text-2xl font-bold">Checkout</h1>
            <div className="flex flex-col space-y-2">
              <label htmlFor="first-name" className="hidden">
                First Name
              </label>
              <input
                type="text"
                id="first-name"
                name="first-name"
                placeholder="First Name"
                required
                className="p-2 border-[1px] border-gray-300 rounded-md outline-none"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="last-name" className="hidden">
                Last Name
              </label>
              <input
                type="text"
                id="last-name"
                name="last-name"
                placeholder="Last Name"
                required
                className="p-2 border-[1px] border-gray-300 rounded-md outline-none"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="email" className="hidden">
                Phone Number
              </label>
              <input
                type="phone-number"
                id="phone-number"
                name="email"
                placeholder="Phone Number"
                required
                className="p-2 border-[1px] border-gray-300 rounded-md outline-none"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="address" className="hidden">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                placeholder="Address"
                required
                className="p-2 border-[1px] border-gray-300 rounded-md outline-none"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="quantity" className="hidden">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                placeholder="City"
                required
                className="p-2 border-[1px] border-gray-300 rounded-md outline-none"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="price" className="hidden">
                Post Code
              </label>
              <input
                type="text"
                id="post-code"
                name="post-code"
                placeholder="Post Code"
                required
                className="p-2 border-[1px] border-gray-300 rounded-md outline-none"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="price" className="hidden">
                Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                placeholder="country"
                required
                className="p-2 border-[1px] border-gray-300 rounded-md outline-none"
              />
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
      <div className="w-full lg:w-2/5 flex-none">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Order Summary</h1>
          <div className="flex justify-between my-2">
            <p>{name}</p>
            <div className="flex items-center space-x-2">
              <CircleMinus />
              <input
                className="w-10 outline-none border-[1px] border-gray-300 [&::-webkit-inner-spin-button]:appearance-none text-center"
                type="number"
                value={quantity}
              />
              <CirclePlus />
            </div>
            <p>£{price}</p>
          </div>
          <div className="flex justify-between my-2">
            <p>Total</p>
            <p>£{price * quantity}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Checkout;
