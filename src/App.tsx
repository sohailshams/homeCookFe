import "./App.css";
import { Button } from "./components/ui/button";
import Login from "./components/ui/Login";

function App() {
  return (
    <>
      <Button>ShadCN Button</Button>
      <p className="text-3xl font-bold underline text-red-500">Home Cook</p>
      <Login />
    </>
  );
}

export default App;
