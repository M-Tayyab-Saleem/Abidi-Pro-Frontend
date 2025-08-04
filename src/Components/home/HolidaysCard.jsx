import React, { useState, useEffect, useRef } from "react";
import { FiMoreVertical, FiTrash2, FiCalendar } from "react-icons/fi";
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
    <div className="relative bg-background rounded-xl shadow-md p-5 pt-10 overflow-visible w-full">
      {/* Floating icon (top-left) */}
      <div className="absolute -top-4 left-4 bg-orange-100 text-orange-700 w-10 h-10 flex items-center justify-center rounded-md shadow z-99">
        <FiCalendar className="text-xl" />
      </div>

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg text-text font-semibold">Holidays</h2>
          <p className="text-sm text-cardDescription font-medium cursor-pointer">
            Upcoming Holidays
          </p>
        </div>

        {/* Dropdown menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-md hover:bg-gray-100 transition"
          >
            <FiMoreVertical className="h-5 w-5 text-gray-600" />
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
                <FiTrash2 className="w-4 h-4 mr-2" />
                Delete Card
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Holiday list */}
      <ul className="space-y-2 text-sm">
        {upcomingHolidays.length > 0 ? (
          upcomingHolidays.map((holiday, index) => (
            <li
              key={index}
              style={{ backgroundColor: "rgba(var(--color-primary-rgb), 0.3)" }}
              className="flex items-center bg-primary rounded p-2 gap-3"
            >
              {/* Dynamic Icon */}
              <div
                className={`w-10 h-10 flex items-center justify-center rounded ${getHolidayColor(holiday.holidayType)} text-lg`}
              >
                {getHolidayIcon(holiday.holidayType)}
              </div>

              {/* Info */}
              <div>
                <div className="font-semibold text-text">{holiday.holidayName}</div>
                <div className="text-xs text-text">
                  {new Date(holiday.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}{' '}
                  <span className="text-gray-400">|</span> {holiday.day}
                </div>
              </div>
            </li>
          ))
        ) : (
          <div className="text-center text-gray-500 py-2">
            No upcoming holidays
          </div>
        )}
      </ul>
    </div>
  );
};

export default HolidaysCard;