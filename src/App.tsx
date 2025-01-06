import "./App.css";
import FoodList from "./components/FoodList";
import Login from "./components/Login";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { useAuth } from "./contexts/AuthContext";
import Spinner from "./components/Spinner";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { user } = useAuth();
  if (user === undefined) return <Spinner />;

  return (
    <>
      <Toaster position="bottom-left" />
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to={"/food-list"} /> : <Login />}
        />
        <Route
          path="/food-list"
          element={
            <ProtectedRoute>
              <FoodList />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
