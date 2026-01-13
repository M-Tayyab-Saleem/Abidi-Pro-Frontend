import React, { useState, useEffect, useRef } from "react";
import { FiCalendar, FiTrash2 } from "react-icons/fi";
import { LuMoonStar } from "react-icons/lu";
import { BsStars } from "react-icons/bs";
import { FaTree } from "react-icons/fa";
import holidayApi from '../../api/holidayApi';

const HolidaysCard = ({ onDelete }) => {

  const [menuOpen, setMenuOpen] = useState(false);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef();

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const data = await holidayApi.getAllHolidays();
        setHolidays(data);
      } catch (error) {
        console.error("Error fetching holidays:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHolidays();
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

  const today = new Date();
  const upcomingHolidays = holidays
    .filter(h => new Date(h.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3); // Only show the next 3 upcoming holidays

  const getHolidayIcon = (holidayType) => {
    switch (holidayType.toLowerCase()) {
      case 'religious':
        return <LuMoonStar />;
      case 'national':
        return <BsStars />;
      case 'observance':
        return <FaTree />;
      default:
        return <FiCalendar />;
    }
  };

  const getHolidayColor = (holidayType) => {
    switch (holidayType.toLowerCase()) {
      case 'religious':
        return "bg-orange-100 text-orange-700";
      case 'national':
        return "bg-lime-100 text-lime-700";
      case 'observance':
        return "bg-indigo-100 text-indigo-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="relative bg-background rounded-xl shadow-md p-5 pt-10 overflow-visible w-full">
        <div className="absolute -top-4 left-4 bg-orange-100 text-orange-700 w-10 h-10 flex items-center justify-center rounded-md shadow z-99">
          <FiCalendar className="text-xl" />
        </div>
        <div className="text-center py-4">Loading holidays...</div>
      </div>
    );
  }

  return (
    <div className="relative bg-white/80 backdrop-blur-sm rounded-[1.2rem] shadow-sm border border-white/40 p-3">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <FiCalendar className="w-3 h-3 text-orange-600" />
            <h3 className="text-[10px] font-bold text-slate-800 uppercase tracking-tight">Holidays</h3>
          </div>
          <p className="text-[9px] font-medium text-slate-500">Upcoming</p>
        </div>

        <button
          onClick={onDelete}
          className="text-[8px] text-slate-500 hover:text-red-500 font-medium px-1.5 py-0.5 rounded-[0.6rem] hover:bg-red-50 transition"
        >
          Remove
        </button>
      </div>

      {/* Holiday list */}
      <ul className="space-y-1.5 text-[9px]">
        {holidays.slice(0, 3).map((holiday, index) => (
          <li
            key={index}
            className="flex items-center bg-[#E0E5EA]/30 rounded-[0.6rem] p-1.5 gap-2"
          >
            <div className={`w-6 h-6 flex items-center justify-center rounded ${getHolidayColor(holiday.holidayType)}`}>
              {getHolidayIcon(holiday.holidayType)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-slate-700 truncate text-[8px]">{holiday.holidayName}</div>
              <div className="text-[7px] text-slate-500 truncate">
                {new Date(holiday.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HolidaysCard;