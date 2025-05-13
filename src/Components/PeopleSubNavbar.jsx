import React from "react";
import { Navbar, MobileNav, IconButton, Button } from "@material-tailwind/react";
import { NavLink } from "react-router-dom";
import { CalendarDaysIcon, PhoneIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const PeopleSubNavbar = () => {
  const [openNav, setOpenNav] = React.useState(false);
  

  const [checkInButton, setCheckInButton] = useState(false);

  const handleButton = () =>{
    setCheckInButton((prev) => !prev)
  }


  const links = [
    { name: "Home", path: "/people" },
    { name: "Time Tracker", path: "/people/timetracker" },
    { name: "Files", path: "/people/files" },
    { name: "Profile", path: "/people/profile" },
  ];

  React.useEffect(() => {
    const handleResize = () => window.innerWidth >= 960 && setOpenNav(false);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinks = (
    <ul className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-6 text-sm font-medium">
    {links.map((link) => (
      <li key={link.name}>
        <NavLink
          to={link.path}
          end={link.path === "/people"}
          className={({ isActive }) =>
            `px-3 py-2 rounded-md transition-colors duration-100 ${
              isActive
                ? "bg-primary text-white"
                : "text-text  hover:text-text"
            }`
          }
        >
          {link.name}
        </NavLink>
      </li>
    ))}
  </ul>
    
  );

  return (
    <Navbar className="sticky top-0 z-10 max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4 bg-background shadow-none border-none">
      <div className="flex items-center justify-between text-blue-gray-900">
        {/* Check In Button (left) */}
        <Button
          size="large"
          className={` w-32 text-center text-green-800 font-semibold shadow  transition px-5 py-3
            ${checkInButton ? "bg-red-400 text-red-800" : "bg-green-400 text-green-800"}`
            
          }
          onClick={handleButton}
        >
          {checkInButton ? "Check Out" : "Check In"}
        </Button>

        {/* Center Nav Links */}
        <div className="hidden lg:block">{navLinks}</div>

        {/* Contact Icons */}
        <div className="hidden lg:flex items-center space-x-4">
          <PhoneIcon className="w-5 h-5 text-text hover:text-blue-500 cursor-pointer" />
          <CalendarDaysIcon className="w-5 h-5 text-text hover:text-blue-500 cursor-pointer" />
        </div>

        {/* Mobile menu toggle */}
        <IconButton
          variant="text"
          className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          ripple={false}
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </IconButton>
      </div>

      {/* Mobile nav panel */}
      <MobileNav open={openNav}>
        <div className="flex flex-col gap-4 mt-5">
          {navLinks}
          <div className="flex items-center space-x-4">
            <PhoneIcon className="w-5 h-5 text-gray-600 hover:text-blue-500 cursor-pointer" />
            <CalendarDaysIcon className="w-5 h-5 text-gray-600 hover:text-blue-500 cursor-pointer" />
          </div>
        </div>
      </MobileNav>
    </Navbar>
  );
};

export default PeopleSubNavbar;
