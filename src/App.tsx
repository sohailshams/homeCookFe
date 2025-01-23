import "./App.css";
import FoodList from "./components/FoodList";
import Login from "./components/Login";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { useAuth } from "./contexts/AuthContext";
import Spinner from "./components/Spinner";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import FoodDetail from "./components/FoodDetail";

function App() {
  const { user } = useAuth();
  if (user === undefined) return <Spinner />;

  return (
    <>
      <Toaster position="bottom-left" />
      <Routes>
        <Route
          index
          element={!user ? <Login /> : <Navigate to={"/food-list"} />}
        />
        <Route element={<Layout />}>
          <Route
            path="/food-list"
            element={
              <ProtectedRoute>
                <FoodList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/food/:foodId"
            element={
              <ProtectedRoute>
                <FoodDetail />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
