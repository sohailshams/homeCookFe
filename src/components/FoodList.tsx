import axios from "axios";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const FoodList: React.FC = () => {
  const [food, setFood] = useState();
  console.log("food", food);

  useEffect(() => {
    const parameters = { useCookies: true };
    axios
      .get("https://localhost:7145/api/food", {
        withCredentials: true,
        params: parameters,
      })
      .then((response) => {
        setFood(response.data);
      })
      .catch(() => {
        toast.error("Error fetching food list from database.", {
          duration: Infinity,
          action: {
            label: <X />,
            onClick: () => toast.dismiss(),
          },
          id: "fetching-error-toast",
        });
      });
  }, []);

  return <h1>Food List</h1>;
};
export default FoodList;
