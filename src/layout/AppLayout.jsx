import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavBarVertical from "../Components/NavBarVertical";
import SubNavbarVertical from "../Components/SubNavbarVertical";
import { 
  UserCircleIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  MagnifyingGlassIcon,
  BellIcon,
  Cog6ToothIcon 
} from "@heroicons/react/24/solid";

const AppLayout = () => {
  const [isRightBarOpen, setRightBarOpen] = useState(true);
  const location = useLocation();
  const isPeoplePortal = location.pathname.startsWith("/people");

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#CDD9EA] font-sans">
      
      {/* Header without blur */}
      <header className="w-full h-12 flex items-center justify-between px-6 z-[60] bg-transparent">
        {/* Left: Brand */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-slate-800 rounded-md flex items-center justify-center text-white text-[10px] font-bold">
            A
          </div>
          <span className="text-xs font-bold tracking-tight text-slate-800 uppercase">
            Abidi Pro
          </span>
        </div>

        {/* Right: Search, Notification, Settings */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-[0.6rem] text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 w-48"
            />
          </div>

          {/* Notification Icon */}
          <button className="relative p-1.5 hover:bg-slate-100 rounded-[0.6rem] transition-colors">
            <BellIcon className="h-4 w-4 text-slate-600" />
            <span className="absolute top-1 right-1 h-1.5 w-1.5 bg-red-500 rounded-full"></span>
          </button>

          {/* Settings Icon */}
          <button className="p-1.5 hover:bg-slate-100 rounded-[0.6rem] transition-colors">
            <Cog6ToothIcon className="h-4 w-4 text-slate-600" />
          </button>
        </div>
      </header>

      <div className="flex w-full items-start">
        
        {/* Sidebar with equal height navbars */}
        <aside className="sticky top-12 z-50 flex h-[calc(100vh-48px)] pl-2">  
          {/* NavBarVertical and SubNavbarVertical now have equal height */}
          <div className="flex items-stretch h-full mr-2">
            <div className="flex items-center">
              <NavBarVertical />
            </div>
            <div className="flex items-center">
              <SubNavbarVertical />
            </div>
          </div>
        </aside>

        {/* Main Content Container */}
        <main className="flex-1 m-3 ml-1 rounded-[2rem] bg-[#F7FAFC] shadow-inner text-slate-800 h-[calc(100vh-80px)] transition-all duration-500 ease-in-out overflow-hidden">
          <div className="p-4 h-full overflow-auto">
            <Outlet />
          </div>
        </main>

        {isPeoplePortal && (
          <aside className={`sticky top-12 z-50 h-[calc(100vh-48px)] transition-all duration-500 ease-in-out flex-shrink-0 flex items-start py-2 pr-3 ${
            isRightBarOpen ? "w-48" : "w-6"
          }`}>
            
            {/* Toggle Button */}
            <button
              onClick={() => setRightBarOpen(!isRightBarOpen)}
              className="absolute -left-3 top-10 z-[70] p-1 bg-white border border-slate-300 shadow-sm rounded-full text-slate-600 hover:text-slate-800 transition-transform active:scale-90"
            >
              {isRightBarOpen ? (
                <ChevronRightIcon className="w-3 h-3" />
              ) : (
                <ChevronLeftIcon className="w-3 h-3" />
              )}
            </button>

            {/* Sidebar UI Content */}
            <div className={`h-full w-full bg-white/90 rounded-[2rem] shadow-sm border border-slate-200 flex flex-col items-center py-4 px-3 overflow-hidden transition-all duration-500 ease-in-out ${
              isRightBarOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
            }`}>
              
              <div className="flex flex-col items-center w-full mb-4">
                <div className="w-14 h-14 rounded-full border-2 border-white shadow-sm mb-2 bg-slate-200 flex items-center justify-center">
                  <UserCircleIcon className="w-14 h-14 text-slate-400" />
                </div>
                
                <div className="text-center bg-white/80 rounded-xl px-3 py-1.5 w-full mb-3 shadow-sm border border-slate-100">
                  <h3 className="text-xs font-bold text-slate-800">- Name -</h3>
                  <p className="text-[9px] font-medium text-slate-500 uppercase tracking-wide">- Designation -</p>
                </div>
                
                <button className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold py-1.5 px-6 rounded-full shadow-sm transition-colors active:scale-95 mb-4">
                  Check In
                </button>

                <div className="flex items-center justify-center gap-1">
                   <div className="bg-slate-100 text-slate-800 w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold shadow-inner">05</div>
                   <span className="text-slate-800 font-bold text-xs">:</span>
                   <div className="bg-slate-100 text-slate-800 w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold shadow-inner">36</div>
                   <span className="text-slate-800 font-bold text-xs">:</span>
                   <div className="bg-slate-100 text-slate-800 w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold shadow-inner">00</div>
                </div>
              </div>

              <div className="w-full bg-white/90 rounded-xl p-2.5 mb-3 shadow-sm border border-slate-100">
                <p className="text-[8px] font-bold text-slate-500 uppercase mb-1.5">Reporting Manager</p>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-300" />
                  <div className="overflow-hidden">
                    <p className="text-[10px] font-bold text-slate-800 truncate">Murtaza Mehmood</p>
                    <p className="text-[8px] text-slate-600 truncate">Project Manager</p>
                  </div>
                </div>
              </div>

              <div className="w-full bg-white/90 rounded-xl p-2.5 flex-1 shadow-sm border border-slate-100 flex flex-col min-h-0">
                <p className="text-[8px] font-bold text-slate-500 uppercase mb-2">Team Overview</p>
                <div className="flex flex-col gap-2 overflow-hidden">
                  {[
                    { role: "Manager", name: "Murtaza Mehmood" },
                    { role: "Developer", name: "Zara Gul" },
                    { role: "Developer", name: "Aqsa Mehmood" },
                    { role: "Developer", name: "Robina" },
                  ].map((member, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-200 shrink-0" />
                      <div className="overflow-hidden">
                        <p className="text-[9px] font-bold text-slate-700 truncate">{member.role}</p>
                        <p className="text-[8px] text-slate-500 truncate">{member.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default AppLayout;