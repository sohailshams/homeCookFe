import "./App.css";
import FoodList from "./components/FoodList";
import Login from "./components/ui/Login";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster position="bottom-left" />
      <p className="text-3xl font-bold underline text-red-500">Home Cook</p>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/food-list" element={<FoodList />} />
      </Routes>
    </>
  );
}

export default App;
