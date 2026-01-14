import React from "react";
import { useLocation, NavLink } from "react-router-dom";
import { ClockIcon, UserCircleIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import { moduleConfigs } from "../routeConfig";

const SubNavbarVertical = () => {
  const { pathname } = useLocation();
  const mainModule = pathname.split("/")[1] || "Menu";
  const links = moduleConfigs[mainModule]?.links || [];

  const iconMap = { 
    "Profile": UserCircleIcon, 
    "Attendance": ClockIcon, 
    "default": CalendarDaysIcon 
  };

  if (!links.length) return null;

  return (
    <aside className="w-[5.5rem] h-[85vh] bg-white/90 backdrop-blur-sm rounded-[1.8rem] flex flex-col items-center py-6 z-10 shadow-sm border border-white/50">
      {/* Module Title Header */}
      <div className="mb-5">
        <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">
          {mainModule}
        </span>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-2 w-full px-2 overflow-y-auto no-scrollbar">
        {links.map((link) => {
          const Icon = iconMap[link.name] || iconMap["default"];
          return (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `w-full py-3 flex flex-col items-center justify-center rounded-[1.2rem] transition-all duration-300 ${
                  isActive 
                    ? "bg-[#E0E5EA] text-slate-900 shadow-sm" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              <Icon className="w-5 h-5 mb-1.5" />
              <span className="text-[10px] font-bold uppercase tracking-tight text-center px-1 leading-tight max-w-[70px]">
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