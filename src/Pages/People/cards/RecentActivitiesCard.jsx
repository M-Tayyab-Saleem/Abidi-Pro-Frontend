import React, { useState, useRef, useEffect } from "react";
import { EllipsisVerticalIcon, TrashIcon } from "@heroicons/react/24/solid";

// Mock activity data with distinct color styles
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
    <div className="relative bg-white rounded-xl shadow-md p-5 pt-10 w-full">
      {/* Floating Icon */}
      <div className="absolute -top-4 left-4 bg-purple-100 text-purple-700 w-10 h-10 flex items-center justify-center rounded-md shadow z-10 text-xl">
        🕓
      </div>

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-semibold ">Recent Activities</h2>
          <p className="text-sm font-medium text-purple-700">Logs of team actions & updates</p>
        </div>

        {/* Custom Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-md hover:bg-gray-100 transition"
          >
            <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-md border rounded-md z-50">
              <button
                onClick={() => {
                  onDelete();
                  setMenuOpen(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
              >
                <TrashIcon className="w-4 h-4 mr-2" />
                Delete Card
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Activity Items */}
      <ul className="space-y-3 text-sm">
        {recentActivities.map((item) => (
          <li
            key={item.id}
            className={`${item.color} px-4 py-3 rounded-lg flex items-start gap-3`}
          >
            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full font-bold bg-white/60 ring-1 ring-black/5 text-lg">
              {item.user[0]}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">
                <span className="text-black font-semibold">{item.user}</span> {item.action}
              </p>
              <span className="text-xs text-gray-600">{item.time}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivitiesCard;
