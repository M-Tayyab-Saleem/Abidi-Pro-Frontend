import React, { useState, useRef, useEffect } from "react";
import { EllipsisVerticalIcon, TrashIcon } from "@heroicons/react/24/outline";

// Mock data
const holidays = [
  {
    title: "Eid al-Adha",
    date: "6 June 2025",
    day: "Friday",
    icon: "✨",
    color: "bg-orange-100 text-orange-700",
  },
  {
    title: "Ashura",
    date: "5 July 2025",
    day: "Saturday",
    icon: "🌙",
    color: "bg-lime-100 text-lime-700",
  },
  {
    title: "Christmas Day",
    date: "1 December 2025",
    day: "Friday",
    icon: "🎄",
    color: "bg-indigo-100 text-indigo-700",
  },
];

const HolidaysCard = ({ onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  // Close dropdown on outside click
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
    <div className="relative bg-white rounded-xl shadow-md p-5 pt-10 overflow-visible w-full">
      {/* Floating icon */}
      <div className="absolute -top-4 left-4 bg-orange-100 text-orange-700 w-10 h-10 flex items-center justify-center rounded-md shadow z-10">
        <span className="text-xl">⚖️</span>
      </div>

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-semibold">Holidays</h2>
          <p className="text-sm text-blue-600 font-medium cursor-pointer">
            Upcoming Holidays
          </p>
        </div>

        {/* Custom Dropdown Menu */}
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

      {/* Holiday List */}
      <ul className="space-y-2 text-sm">
        {holidays.map((item, index) => (
          <li
            key={index}
            className="flex items-center bg-gray-100 rounded p-2 gap-3"
          >
            {/* Emoji Icon */}
            <div
              className={`w-10 h-10 flex items-center justify-center rounded ${item.color} text-lg`}
            >
              {item.icon}
            </div>

            {/* Holiday Info */}
            <div>
              <div className="font-semibold text-gray-800">{item.title}</div>
              <div className="text-xs text-gray-600">
                {item.date} <span className="text-gray-400">|</span> {item.day}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HolidaysCard;
