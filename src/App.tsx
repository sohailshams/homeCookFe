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
import AddFood from "./components/AddFood";
import { TooltipProvider } from "@/components/ui/tooltip";
import Profile from "./components/Profile";
import PostcodeSearchBox from "./components/PostcodeSearchBox";
import PostLoginRedirect from "./components/PostLoginRedirect";

function App() {
  const { user } = useAuth();
  if (user === undefined) return <Spinner />;

  return (
    <>
      <TooltipProvider>
        <Toaster position="bottom-left" />
        <Routes>
          <Route
            index
            element={!user ? <Login /> : <Navigate to={"/redirect"} />}
          />
          <Route
            path="/redirect"
            element={
              <ProtectedRoute>
                <PostLoginRedirect />
              </ProtectedRoute>
            }
          />
          <Route
            path="/postcode-search"
            element={
              // <ProtectedRoute>
              <PostcodeSearchBox />
              // </ProtectedRoute>
            }
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
              path="/checkout"
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
            <Route
              path="/add-food"
              element={
                <ProtectedRoute>
                  <AddFood />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </TooltipProvider>
    </>
  );
}

export default App;
