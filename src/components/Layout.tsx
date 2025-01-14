import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Categories from "./Categories";

const Layout: React.FC = () => {
  return (
    <div>
      <Navbar />
      <Categories />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
