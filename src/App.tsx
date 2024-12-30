import "./App.css";
import Test from "./components/Test";
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
        <Route path="/test" element={<Test />} />
      </Routes>
    </>
  );
}

export default App;
