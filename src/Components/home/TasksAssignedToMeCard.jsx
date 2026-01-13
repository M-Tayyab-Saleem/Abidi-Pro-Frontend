import React, { useState, useRef, useEffect } from "react";
import { FiMoreVertical, FiTrash2, FiClipboard } from "react-icons/fi";

const assignedTasks = [
  {
    title: "Prepare project update deck",
    status: "In Progress",
  },
  {
    title: "Finalize team onboarding",
    status: "Pending",
  },
  {
    title: "Submit time log for April",
    status: "Completed",
  },
];

const TasksAssignedToMeCard = ({ onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative bg-white/80 backdrop-blur-sm rounded-[1.2rem] shadow-sm border border-white/40 p-3">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <FiClipboard className="w-3 h-3 text-purple-600" />
            <h3 className="text-[10px] font-bold text-slate-800 uppercase tracking-tight">Tasks Assigned</h3>
          </div>
          <p className="text-[9px] font-medium text-slate-500">
            Active and pending tasks
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

      {/* Task list */}
      <ul className="space-y-1.5 text-[9px]">
        {assignedTasks.map((item, index) => (
          <li
            key={index}
            className="bg-[#E0E5EA]/30 rounded-[0.6rem] px-2 py-1.5 flex items-center justify-between gap-2"
          >
            <div className="min-w-0 flex-1">
              <span className="font-medium text-slate-700 truncate block">{item.title}</span>
              <div className="text-[8px] text-slate-500">Status: {item.status}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TasksAssignedToMeCard;