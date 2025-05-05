import React, { useState, useRef, useEffect } from "react";
import { EllipsisVerticalIcon, TrashIcon } from "@heroicons/react/24/solid";

const leaveLogs = [
  {
    name: "Paul Richards",
    date: "May 1, 2025",
    type: "Sick Leave",
    status: "Approved",
    color: "bg-red-100 text-red-700",
  },
  {
    name: "Anita Gomez",
    date: "May 3, 2025",
    type: "Casual Leave",
    status: "Pending",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    name: "Liam Wong",
    date: "May 6, 2025",
    type: "Work From Home",
    status: "Approved",
    color: "bg-green-100 text-green-700",
  },
];

const LeaveLogCard = ({ onDelete }) => {
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
      <div className="absolute -top-4 left-4 bg-blue-100 text-blue-700 w-10 h-10 flex items-center justify-center rounded-md shadow z-10 text-lg">
        🗓️
      </div>

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-semibold text-blue-700">Leave Logs</h2>
          <p className="text-sm text-gray-500">Track your leave history</p>
        </div>

        {/* Dropdown */}
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

      {/* Logs */}
      <ul className="space-y-2 text-sm">
        {leaveLogs.map((log, index) => (
          <li
            key={index}
            className={`p-3 rounded flex justify-between items-center ${log.color}`}
          >
            <div className="flex flex-col">
              <span className="font-semibold">{log.name}</span>
              <span className="text-xs text-gray-600">{log.date}</span>
            </div>
            <div className="flex flex-col text-right text-xs">
              <span className="font-medium">{log.type}</span>
              <span
                className={`${
                  log.status === "Approved"
                    ? "text-green-700"
                    : "text-yellow-800"
                }`}
              >
                {log.status}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaveLogCard;
