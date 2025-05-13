import { Outlet } from "react-router-dom";
import PeopleSubNavbar from "../Components/PeopleSubNavbar";

const PeopleLayout = () => {
  return (
    <div>
      <PeopleSubNavbar />
      <div className="">
        <Outlet />
      </div>
    </div>
  );
};

export default PeopleLayout;
