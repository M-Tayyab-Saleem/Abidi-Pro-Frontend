import React from "react";
import { useLocation, NavLink } from "react-router-dom";
import { ClockIcon, UserCircleIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import { moduleConfigs } from "../routeConfig";

const SubNavbarVertical = () => {
  const { pathname } = useLocation();
  const mainModule = pathname.split("/")[1] || "Menu";
  const links = moduleConfigs[mainModule]?.links || [];

  const iconMap = { "Profile": UserCircleIcon, "Attendance": ClockIcon, "default": CalendarDaysIcon };

  if (!links.length) return null;

  return (
    <aside className="w-18 h-[85vh] bg-white rounded-[1.8rem] flex flex-col items-center py-6 z-10">
      {/* Reduced Title Header */}
      <div className="mb-4">
        <span className="text-[7px] font-black text-black uppercase tracking-widest">
          {mainModule}
        </span>
      </div>

      {/* Tighter Nav List */}
      <div className="flex flex-col gap-1.5 w-full px-1.5 overflow-y-auto no-scrollbar mr">
        {links.map((link) => {
          const Icon = iconMap[link.name] || iconMap["default"];
          return (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `w-full py-2.5 flex flex-col items-center justify-center rounded-[1.2rem] transition-all duration-300 ${
                  isActive ? "bg-[#E0E5EA] text-black shadow-sm" : "text-black hover:bg-white/50"
                }`
              }
            >
              <Icon className="w-3 h-4 mb-0.5 " />
              <span className="text-[7px] font-bold uppercase tracking-tight text-center px-0.5 leading-none max-w-[60px]">
                {link.name}
              </span>
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
};

export default SubNavbarVertical; 