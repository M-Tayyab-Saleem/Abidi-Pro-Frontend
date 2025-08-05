import React, { useState, useEffect, useRef } from "react";
import { GoGraph } from "react-icons/go";
import { EllipsisVerticalIcon, TrashIcon } from "@heroicons/react/24/outline";
import api from "../../axios";
import { toast } from "react-toastify";

const AttendanceCard = ({ onDelete }) => {
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const maxBarHeight = 100;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  // Get current week start date (Monday)
  const getWeekStartDate = () => {
    const today = new Date();
    const start = new Date(today);
    const dayOfWeek = start.getDay();
    const diff = start.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);
    return start;
  };

  // Fetch weekly attendance data
  const fetchWeeklyData = async () => {
    try {
      setLoading(true);
      const weekStart = getWeekStartDate();
      const month = weekStart.getMonth() + 1;
      const year = weekStart.getFullYear();
      
      const response = await api.get(`/timetrackers/attendance/${month}/${year}`);
      console.log("Weekly Attendance Data:", response.data);
      processWeeklyData(response.data, weekStart);
    } catch (error) {
      toast.error("Failed to load attendance data");
      console.error("Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  // Process the data to match the weekly structure
const processWeeklyData = (attendanceData, weekStart) => {
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(weekStart);
    currentDay.setDate(weekStart.getDate() + i);
    currentDay.setHours(0, 0, 0, 0);

    // Find matching attendance record
    const dayData = attendanceData.find(d => {
      const recordDate = new Date(d.date);
      recordDate.setHours(0, 0, 0, 0);
      return recordDate.getTime() === currentDay.getTime();
    });

    // Calculate hours worked
    let hours = 0;
    let status = currentDay > today ? 'Upcoming' : 'Absent';
    
    if (dayData) {
      status = dayData.status || status;
      
      if (dayData.totalHours) {
        hours = dayData.totalHours;
      } else if (dayData.checkInTime && dayData.checkOutTime) {
        // Calculate hours from check-in/check-out times
        const checkIn = new Date(dayData.checkInTime);
        const checkOut = new Date(dayData.checkOutTime);
        const diffMs = checkOut - checkIn;
        hours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));
      } else if (dayData.status === 'Present') {
        hours = 8; // Default full day
      } else if (dayData.status === 'Half Day') {
        hours = 4; // Default half day
      }
    }

    days.push({
      day: currentDay.toLocaleDateString("en-US", { weekday: "short" }),
      hours: hours,
      date: currentDay.getDate(),
      status: status
    });
  }

  console.log("Processed Weekly Data:", days); // Debug log
  setWeeklyData(days);
};

  useEffect(() => {
    fetchWeeklyData();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalHours = weeklyData.reduce((sum, val) => sum + val.hours, 0);

  return (
    <div className="w-full max-w-md mx-auto bg-background rounded-2xl shadow p-4 sm:p-6 relative">
      {/* Top Icon */}
      <div className="absolute -top-5 left-5 bg-blue-200 text-green-800 w-10 h-10 flex items-center justify-center rounded-md shadow z-99">
        <GoGraph />
      </div>

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg mt-5 text-text font-semibold">Weekly Attendance</h2>
          <p className="text-cardDescription text-sm font-medium">{totalHours} total hours</p>
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
                  onDelete?.();
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

      {/* Bar Chart */}
      <div className="bg-primary to-indigo-100 rounded-xl px-2 py-4 sm:px-4"
      style={{ backgroundColor: "rgba(var(--color-primary-rgb), 0.3)" }}>
        <div className="flex items-end justify-between h-36 sm:h-44 gap-2 sm:gap-3">
          {weeklyData.map(({ day, hours, status }, i) => {
            let color = "bg-gray-300";
            if (status === 'Absent') color = "bg-red-500";
            else if (status === 'Present' && hours >= 7) color = "bg-green-600";
            else if (status === 'Half Day') color = "bg-yellow-500";
            else if (status === 'Present') color = "bg-indigo-400";
            else if (status === 'Upcoming') color = "bg-gray-300";

            const barHeight = Math.min((hours / 10) * maxBarHeight, maxBarHeight);

            return (
              <div key={i} className="flex flex-col items-center justify-end flex-1">
                <div
                  className={`w-2 sm:w-3 ${color} rounded transition-all duration-300`}
                  style={{ height: `${barHeight}px` }}
                ></div>
                <div className="mt-1 text-center leading-tight">
                  <span className="block text-[10px] sm:text-xs font-semibold text-text">
                    {day}
                  </span>
                  <span className="block text-[10px] sm:text-xs text-heading">
                    {status === 'Upcoming' ? '-' : `${hours}h`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AttendanceCard;