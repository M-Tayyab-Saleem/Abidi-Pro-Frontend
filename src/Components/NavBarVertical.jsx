import { NavLink } from "react-router-dom";
import { UsersIcon, FolderIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

const NavBarVertical = () => {
  const navLinks = [
    { name: "Peoples", to: "/people", icon: UsersIcon },
    { name: "Project", to: "/project", icon: FolderIcon },
    { name: "Admin", to: "/admin", icon: Cog6ToothIcon },
  ];

  return (
    <nav className="w-12 flex flex-col items-end gap-1 mt-8 bg-transparent z-20">
      {navLinks.map(({ name, to, icon: Icon }) => (
        <NavLink
          key={name}
          to={to}
          className={({ isActive }) =>
            `relative flex items-center justify-center w-14 h-14 transition-all duration-300 ${
              isActive 
                ? "bg-white text-black rounded-l-3xl translate-x-[1px] shadow-[-2px_0_5px_rgba(0,0,0,0.05)]" 
                : "text-slate-500 hover:text-white"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon className="w-5 h-5" />
              
              {isActive && (
                <>
                  {/* Smaller Scoop Curves */}
                  {/* <div className="absolute -top-3 right-0 w-3 h-3 bg-transparent rounded-br-xl shadow-[3px_3px_0_0_#fff]" />
                  <div className="absolute -bottom-3 right-0 w-3 h-3 bg-transparent rounded-tr-xl shadow-[3px_-3px_0_0_#fff]" /> */}
                </>
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default NavBarVertical;