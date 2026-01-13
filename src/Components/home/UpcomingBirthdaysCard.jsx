import React, { useRef, useState, useEffect } from "react";
import { FiMoreVertical, FiTrash2, FiGift } from "react-icons/fi";
import api from "../../axios";
import { toast } from "react-toastify";

const UpcomingBirthdaysCard = ({ onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [birthdays, setBirthdays] = useState([]);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef();

  useEffect(() => {
    const fetchBirthdays = async () => {
      try {
        const response = await api.get('/users/birthdays/upcoming');
        setBirthdays(response.data);
      } catch (error) {
        console.error("Failed to fetch birthdays:", error);
        toast.error("Failed to load birthday data");
      } finally {
        setLoading(false);
      }
    };

    fetchBirthdays();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (loading) {
    return (
      <div className="relative bg-white/80 backdrop-blur-sm rounded-[1.2rem] shadow-sm border border-white/40 p-3 w-full">
        <div className="flex items-center gap-1.5 mb-2">
          <FiGift className="w-3 h-3 text-pink-600" />
          <h3 className="text-[10px] font-bold text-slate-800 uppercase tracking-tight">Upcoming Birthdays</h3>
        </div>
        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-pink-500 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="relative bg-white/80 backdrop-blur-sm rounded-[1.2rem] shadow-sm border border-white/40 p-3 w-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <FiGift className="w-3 h-3 text-pink-600" />
            <h3 className="text-[10px] font-bold text-slate-800 uppercase tracking-tight">Upcoming Birthdays</h3>
          </div>
          <p className="text-[9px] font-medium text-slate-500">Celebrate your team!</p>
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

      {/* List of Birthdays */}
      {birthdays.length > 0 ? (
        <ul className="space-y-1.5 text-[9px]">
          {birthdays.slice(0, 3).map((b, index) => (
            <li
              key={index}
              className="bg-pink-50 rounded-[0.6rem] p-2 flex items-center gap-2"
            >
              <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700">
                {b.name?.[0] || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-800 truncate">{b.name || "Unknown"}</div>
                <div className="text-[8px] text-slate-600 truncate">
                  {b.date || "Date unknown"}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-3 text-[9px] text-slate-500">
          No upcoming birthdays
        </div>
      )}
    </div>
  );
};

export default UpcomingBirthdaysCard;