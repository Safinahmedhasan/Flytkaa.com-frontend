// Main Component
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar/Navbar";

const Main = () => {
  return (
    <div>
      <Navbar/>
      <div className="min-h-[calc(100vh-68px)]">
        <Outlet></Outlet>
      </div>
    </div>
  );
};

export default Main;
