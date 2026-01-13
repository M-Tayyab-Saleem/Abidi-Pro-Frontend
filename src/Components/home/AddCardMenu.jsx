import React, { useState, useRef, useEffect } from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

const cardOptions = [
  { id: "feeds", label: "Feeds" },
  { id: "attendance", label: "Attendance" },
  { id: "holidays", label: "Holidays" },
  { id: "todo", label: "To-Do" },
  { id: "notes", label: "Notes"},
  { id: "recent activities", label: "Recent activities"},
  { id: "birthdays", label: "Birthdays"},
  { id: "leavelog", label: "Leave Logs"},
  { id: "upcomingDeadlines", label: "Deadlines"},
  { id: "timeoffBalance", label: "Time Off"},
  { id: "tasksAssignedToMe", label: "My Tasks"},
];

const AddCardMenu = ({ onAdd }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* Button with navbar styling */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-2 py-1.5 rounded-[0.8rem] bg-white/80 border border-white/40 hover:bg-white/90 transition text-[10px] font-bold text-slate-700 uppercase tracking-wide shadow-sm"
      >
        More
        <EllipsisVerticalIcon className="h-3 w-3 text-slate-600" />
      </button>

      {/* Dropdown with navbar styling */}
      {open && (
        <div className="absolute right-0 mt-1 w-32 bg-white/90 backdrop-blur-md rounded-[0.8rem] shadow-lg border border-white/40 z-50">
          <ul className="py-1 text-[9px] text-slate-700">
            {cardOptions.map((option) => (
              <li
                key={option.id}
                onClick={() => {
                  onAdd(option.id);
                  setOpen(false);
                }}
                className="px-3 py-1.5 cursor-pointer hover:bg-[#E0E5EA]/50 transition font-medium uppercase tracking-tight"
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AddCardMenu;