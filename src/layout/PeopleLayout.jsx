import { Outlet } from "react-router-dom";
import PeopleSubNavbar from "../Components/PeopleSubNavbar";
import Navbar from "../Components/navbar";

const PeopleLayout = () => {
  console.log("home")
  return (
    <div>
        <Navbar />
      <PeopleSubNavbar />
      <div className="">
        <Outlet />
      </div>
    </div>
  );
};

export default PeopleLayout;
