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
      
      {/* Header */}
      <header className="w-full h-14 flex items-center justify-between px-6 z-[60] bg-transparent">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-md">
            A
          </div>
          <span className="text-sm font-bold tracking-tight text-slate-800 uppercase">
            Abidi Pro
          </span>
        </div>

        {/* Right: Search, Notification, Settings */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-transparent w-64 transition-all"
            />
          </div>

          {/* Notification Icon */}
          <button className="relative p-2 hover:bg-white/50 rounded-xl transition-colors">
            <BellIcon className="h-5 w-5 text-slate-600" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>

          {/* Settings Icon */}
          <button className="p-2 hover:bg-white/50 rounded-xl transition-colors">
            <Cog6ToothIcon className="h-5 w-5 text-slate-600" />
          </button>
        </div>
      </header>

      <div className="flex w-full items-start">
        
        {/* Sidebar with equal height containers */}
        <aside className="sticky top-14 z-50 flex h-[calc(100vh-3.5rem)] pl-2">  
          <div className="flex items-stretch h-full">
            {/* NavBarVertical - centered vertically */}
            <div className="flex items-center h-full">
              <NavBarVertical />
            </div>
            {/* SubNavbarVertical - same height as NavBarVertical */}
            <div className="flex items-center h-full">
              <SubNavbarVertical />
            </div>
          </div>
        </aside>

        {/* Main Content Container */}
     <main className="flex-1 m-3 ml-2 rounded-[2rem] bg-[#ECF0F3] shadow-lg text-slate-800 h-[calc(100vh-5rem)] transition-all duration-500 ease-in-out overflow-hidden">
          <div className="p-5 h-full overflow-auto no-scrollbar">
            <Outlet />
          </div>
        </main>

        {/* Right Sidebar for People Portal */}
        {isPeoplePortal && (
          <aside className={`sticky top-14 z-50 h-[calc(100vh-3.5rem)] transition-all duration-500 ease-in-out flex-shrink-0 flex items-center py-2 pr-3 ${
            isRightBarOpen ? "w-52" : "w-8"
          }`}>
            
            {/* Toggle Button */}
            <button
              onClick={() => setRightBarOpen(!isRightBarOpen)}
              className="absolute -left-4 top-12 z-[70] p-1.5 bg-white border border-slate-200 shadow-md rounded-full text-slate-600 hover:text-slate-900 hover:shadow-lg transition-all active:scale-90"
            >
              {isRightBarOpen ? (
                <ChevronRightIcon className="w-4 h-4" />
              ) : (
                <ChevronLeftIcon className="w-4 h-4" />
              )}
            </button>

            {/* Sidebar Content */}
            <div className={`h-full w-full bg-[#ECF0F3] backdrop-blur-sm rounded-[2rem] shadow-lg border border-white/50 flex flex-col items-center py-5 px-4 overflow-hidden transition-all duration-500 ease-in-out ${
              isRightBarOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
            }`}>
              
              {/* Profile Section */}
              <div className="flex flex-col items-center w-full mb-5">
                <div className="w-16 h-16 rounded-full border-2 border-white shadow-md mb-3 bg-slate-200 flex items-center justify-center">
                  <UserCircleIcon className="w-16 h-16 text-slate-400" />
                </div>
                
                <div className="text-center bg-white rounded-xl px-4 py-2 w-full mb-4 shadow-sm border border-slate-100">
                  <h3 className="text-sm font-bold text-slate-800">- Name -</h3>
                  <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">- Designation -</p>
                </div>
                
                <button className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2 px-8 rounded-full shadow-md transition-all active:scale-95 mb-5">
                  Check In
                </button>

                {/* Timer Display */}
                <div className="flex items-center justify-center gap-1.5">
                  <div className="bg-slate-100 text-slate-800 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shadow-inner">05</div>
                  <span className="text-slate-800 font-bold text-sm">:</span>
                  <div className="bg-slate-100 text-slate-800 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shadow-inner">36</div>
                  <span className="text-slate-800 font-bold text-sm">:</span>
                  <div className="bg-slate-100 text-slate-800 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shadow-inner">00</div>
                </div>
              </div>

              {/* Reporting Manager */}
              <div className="w-full bg-white rounded-xl p-3 mb-3 shadow-sm border border-slate-100">
                <p className="text-[9px] font-bold text-slate-500 uppercase mb-2">Reporting Manager</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-slate-300 shrink-0" />
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-slate-800 truncate">Murtaza Mehmood</p>
                    <p className="text-[9px] text-slate-600 truncate">Project Manager</p>
                  </div>
                </div>
              </div>

              {/* Team Overview */}
              <div className="w-full bg-white rounded-xl p-3 flex-1 shadow-sm border border-slate-100 flex flex-col min-h-0">
                <p className="text-[9px] font-bold text-slate-500 uppercase mb-3">Team Overview</p>
                <div className="flex flex-col gap-2.5 overflow-y-auto no-scrollbar">
                  {[
                    { role: "Manager", name: "Murtaza Mehmood" },
                    { role: "Developer", name: "Zara Gul" },
                    { role: "Developer", name: "Aqsa Mehmood" },
                    { role: "Developer", name: "Robina" },
                  ].map((member, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-200 shrink-0" />
                      <div className="overflow-hidden">
                        <p className="text-[10px] font-bold text-slate-700 truncate">{member.role}</p>
                        <p className="text-[9px] text-slate-500 truncate">{member.name}</p>
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