import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import { useEffect, useState } from "react";
axios.defaults.withCredentials = true;
function Test() {
  const { token } = useAuth();
  const [food, setFood] = useState();
  console.log("food", food);
  const clickHandler = () => {
    const headers = { credentials: "include" };
    const parameters = { useCookies: true };

    axios
      .get("https://localhost:7145/api/food", {
        headers: headers,
        params: parameters,

        // headers: {
        //   // Authorization: `Bearer ${token}`, // Pass the token
        // },
        // withCredentials: true, // Ensure cookies are sent
      })
      .then((response) => {
        console.log("data", response);
        setFood(response.data);
      })
      .catch((error) => {
        console.error("Error fetching foods:", error);
      });
  };

  if (token) {
    console.log("User is authenticated", token);
  }
  return <button onClick={clickHandler}>Test</button>;
}
export default Test;
