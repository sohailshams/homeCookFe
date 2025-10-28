import "./App.css";
import Login from "./components/Login";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { useAuth } from "./contexts/AuthContext";
import Spinner from "./components/Spinner";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import FoodDetail from "./components/FoodDetail";
import CheckoutContainer from "./components/CheckoutContainer";
import PaymentSuccess from "./components/PaymentSuccess";
import { FoodContainer } from "./components/FoodContainer";

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
                <FoodContainer />
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
          <Route
            path="/checkoutContainer"
            element={
              <ProtectedRoute>
                <CheckoutContainer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment-success"
            element={
              <ProtectedRoute>
                <PaymentSuccess />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
