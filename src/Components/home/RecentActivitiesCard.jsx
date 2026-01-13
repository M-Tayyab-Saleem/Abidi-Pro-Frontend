import React, { useState, useRef, useEffect } from "react";
import { FiMoreVertical, FiTrash2, FiClock } from "react-icons/fi";

const recentActivities = [
  {
    id: 1,
    user: "Paul",
    action: "added a new task",
    time: "2 mins ago",
    color: "bg-green-100 text-green-800",
  },
  {
    id: 2,
    user: "Sarah",
    action: "updated project status",
    time: "10 mins ago",
    color: "bg-blue-100 text-blue-800",
  },
  {
    id: 3,
    user: "Admin",
    action: "deleted a holiday",
    time: "1 hour ago",
    color: "bg-red-100 text-red-700",
  },
];

const RecentActivitiesCard = ({ onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative bg-white/80 backdrop-blur-sm rounded-[1.2rem] shadow-sm border border-white/40 p-3 w-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <FiClock className="w-3 h-3 text-purple-600" />
            <h3 className="text-[10px] font-bold text-slate-800 uppercase tracking-tight">Recent Activities</h3>
          </div>
          <p className="text-[9px] font-medium text-slate-500">
            Logs of team actions & updates
          </p>
        </div>

        {/* 3-dot Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 rounded-[0.4rem] hover:bg-slate-100 transition"
          >
            <FiMoreVertical className="h-3 w-3 text-slate-600" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-1 w-28 bg-white shadow-md border border-slate-200 rounded-[0.6rem] z-50">
              <button
                onClick={() => {
                  onDelete();
                  setMenuOpen(false);
                }}
                className="flex items-center w-full px-3 py-1.5 text-[9px] text-red-500 hover:bg-red-50 font-medium"
              >
                <FiTrash2 className="w-2.5 h-2.5 mr-1.5" />
                Delete Card
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Activity Items */}
      <ul className="space-y-1.5 text-[9px]">
        {recentActivities.map((item) => (
          <li
            key={item.id}
            className={`${item.color} px-2 py-1.5 rounded-[0.6rem] flex items-start gap-2`}
          >
            <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full font-bold bg-white border border-slate-300 text-[10px]">
              {item.user[0]}
            </div>
            <div>
              <p className="font-medium text-slate-800">
                <span className="font-semibold">{item.user}</span> {item.action}
              </p>
              <span className="text-[8px] text-slate-600">{item.time}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivitiesCard;