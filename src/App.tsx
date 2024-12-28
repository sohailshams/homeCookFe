import "./App.css";
import Test from "./components/Test";
import { Button } from "./components/ui/button";
import Login from "./components/ui/Login";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Button>ShadCN Button</Button>
      <p className="text-3xl font-bold underline text-red-500">Home Cook</p>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </>
  );
}

export default App;
