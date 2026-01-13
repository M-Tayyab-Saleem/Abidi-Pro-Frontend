import React, { useState, useRef, useEffect } from "react";
import { FiMoreVertical, FiTrash2, FiCalendar } from "react-icons/fi";
import axios from "axios";

const TimeoffBalanceCard = ({ onDelete, userId }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [timeOffData, setTimeOffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef();

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await axios.get(`/users/${userId}/leaves`);
        const leaves = response.data;
        
        const leaveTypes = [
          {
            type: "Paid Leave",
            remaining: `${leaves.paid || 0} days`,
          },
          {
            type: "Sick Leave",
            remaining: `${leaves.sick || 0} days`,
          },
          {
            type: "Majlis Leave",
            remaining: `${leaves.majlis || 0} days`,
          }
        ];
        
        setTimeOffData(leaveTypes);
      } catch (error) {
        console.error("Error fetching leaves:", error);
        setTimeOffData([
          {
            type: "Paid Leave",
            remaining: "3 days",
          },
          {
            type: "Sick Leave",
            remaining: "4 days",
          },
          {
            type: "Majlis Leave",
            remaining: "5 days",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="relative bg-white/80 backdrop-blur-sm rounded-[1.2rem] shadow-sm border border-white/40 p-3">
        <div className="flex items-center gap-1.5 mb-2">
          <FiCalendar className="w-3 h-3 text-blue-600" />
          <h3 className="text-[10px] font-bold text-slate-800 uppercase tracking-tight">Available Leaves</h3>
        </div>
        <p className="text-[9px] font-medium text-slate-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="relative bg-white/80 backdrop-blur-sm rounded-[1.2rem] shadow-sm border border-white/40 p-3">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <FiCalendar className="w-3 h-3 text-blue-600" />
            <h3 className="text-[10px] font-bold text-slate-800 uppercase tracking-tight">Available Leaves</h3>
          </div>
          <p className="text-[9px] font-medium text-slate-500">
            Updated leave availability
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

      {/* Leave types list */}
      <ul className="space-y-1.5 text-[9px]">
        {timeOffData.map((item, index) => (
          <li
            key={index}
            className="bg-[#E0E5EA]/30 rounded-[0.6rem] px-2 py-1.5 flex items-center justify-between gap-2"
          >
            <div className="min-w-0 flex-1">
              <span className="font-medium text-slate-700">{item.type}</span>
              <div className="text-[8px] text-slate-500">{item.remaining}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TimeoffBalanceCard;