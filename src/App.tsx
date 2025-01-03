import "./App.css";
import FoodList from "./components/FoodList";
import Login from "./components/ui/Login";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { useAuth } from "./contexts/AuthContext";
import Spinner from "./components/Spinner";

function App() {
  const { user } = useAuth();
  if (user === undefined) return <Spinner />;

  return (
    <>
      <Toaster position="bottom-left" />
      <Routes>
        <Route
          path="/"
          element={!user ? <Login /> : <Navigate to="/food-list" />}
        />
        <Route
          path="/food-list"
          element={user ? <FoodList /> : <Navigate to="/" />}
        />
      </Routes>
    </>
  );
}

export default App;
