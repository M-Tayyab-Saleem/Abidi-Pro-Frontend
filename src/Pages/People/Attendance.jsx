import React, { useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { IoCalendarNumberOutline } from "react-icons/io5";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaClock, 
  FaUmbrellaBeach,
  FaRegClock,
  FaBusinessTime,
  FaInfoCircle,
  FaRegCalendarAlt
} from "react-icons/fa";

// Status badges with colors and icons
const StatusBadge = ({ status }) => {
  const statusConfig = {
    Present: { icon: <FaCheckCircle className="mr-1" />, color: "bg-green-100 text-green-800" },
    Absent: { icon: <FaTimesCircle className="mr-1" />, color: "bg-red-100 text-red-800" },
    "Half Day": { icon: <FaClock className="mr-1" />, color: "bg-yellow-100 text-yellow-800" },
    Leave: { icon: <FaUmbrellaBeach className="mr-1" />, color: "bg-blue-100 text-blue-800" },
    Holiday: { icon: <FaBusinessTime className="mr-1" />, color: "bg-purple-100 text-purple-800" }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[status]?.color || "bg-gray-100 text-gray-800"}`}>
      {statusConfig[status]?.icon || <FaRegClock className="mr-1" />}
      {status}
    </span>
  );
};

// Generate more realistic dummy data
const generateWeeklyData = (startOfWeek) => {
  const statuses = ["Present", "Absent", "Half Day", "Leave", "Holiday"];
  const days = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);

    if (day > today) {
      // Future day — no status yet
      days.push({
        date: day.getDate(),
        dayName: day.toLocaleDateString("en-US", { weekday: "short" }),
        fullDate: day.toDateString(),
        status: "Upcoming",
        checkIn: null,
        checkOut: null,
        totalHours: 0,
        notes: null,
      });
    } else if (day.toDateString() === today.toDateString()) {
      // Today — show ongoing work
      days.push({
        date: day.getDate(),
        dayName: day.toLocaleDateString("en-US", { weekday: "short" }),
        fullDate: day.toDateString(),
        status: "Working...",
        checkIn: "9:00",
        checkOut: null,
        totalHours: null,
        notes: "Work in progress",
      });
    } else {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const isWorkingDay = status === "Present" || status === "Half Day";
      days.push({
        date: day.getDate(),
        dayName: day.toLocaleDateString("en-US", { weekday: "short" }),
        fullDate: day.toDateString(),
        status,
        checkIn: isWorkingDay ? "9:00" : null,
        checkOut: isWorkingDay ? "17:00" : null,
        totalHours: isWorkingDay ? (status === "Half Day" ? 4 : 8) : 0,
        notes: status === "Leave" ? "Sick leave" : status === "Holiday" ? "Public holiday" : null,
      });
    }
  }

  return days;
};

const formatDate = (date) => {
  return date.toLocaleDateString("en-US", { 
    month: "short", 
    day: "numeric", 
    year: "numeric" 
  });
};

const Attendance = () => {
  const today = new Date();
  const [weekStart, setWeekStart] = useState(() => {
    const start = new Date(today);
    const dayOfWeek = start.getDay(); // 0=Sun,...6=Sat
    const diff = start.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // adjust to Monday
    start.setDate(diff);
    return start;
  });

  const [selectedDate, setSelectedDate] = useState(today);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [expandedView, setExpandedView] = useState(false);

  const weeklyData = generateWeeklyData(weekStart);

  const formatWeekRange = () => {
    const start = new Date(weekStart);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  };

  const navigateToPreviousPeriod = () => {
    const newStart = new Date(weekStart);
    newStart.setDate(newStart.getDate() - 7);
    setWeekStart(newStart);
    setSelectedDay(null);
  };

  const navigateToNextPeriod = () => {
    const newStart = new Date(weekStart);
    newStart.setDate(newStart.getDate() + 7);
    setWeekStart(newStart);
    setSelectedDay(null);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowCalendar(false);
    
    // Adjust to the Monday of the selected week
    const dayOfWeek = date.getDay(); // 0=Sun,...6=Sat
    const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const newStart = new Date(date);
    newStart.setDate(diff);
    setWeekStart(newStart);
  };

  const toggleDayDetails = (index) => {
    setSelectedDay(selectedDay === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-primary p-4 m-6 rounded-lg shadow-md">
      {/* Header card with updated calendar navigation */}
      <div className="flex flex-col bg-background w-full sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 p-4 rounded-md shadow-sm">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-text">Attendance</h2>
          <button 
            onClick={() => setExpandedView(!expandedView)}
            className="text-sm text-text flex items-center gap-1 hover:underline"
          >
            <FaInfoCircle size={14} />
            {expandedView ? "Compact view" : "Detailed view"}
          </button>
        </div>

        <div className="flex flex-row items-center gap-3 mx-4 whitespace-nowrap">
          <button
            onClick={navigateToPreviousPeriod}
            className="p-2 rounded-full bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          >
            <FaAngleLeft size={16} />
          </button>

          <div className="relative">
            <button
              className="px-3 py-2 text-white bg-primary rounded flex items-center gap-2 hover:bg-primary-dark"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              <IoCalendarNumberOutline size={18} />
              <span className="text-sm">{formatWeekRange()}</span>
              <FaRegCalendarAlt size={14} />
            </button>

            {showCalendar && (
              <div className="absolute z-50 mt-2 bg-white shadow-lg rounded-lg border border-gray-200">
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  inline
                  calendarClassName="border-0"
                  renderCustomHeader={({
                    date,
                    decreaseMonth,
                    increaseMonth,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled,
                  }) => (
                    <div className="flex items-center justify-between px-2 py-2">
                      <button
                        onClick={decreaseMonth}
                        disabled={prevMonthButtonDisabled}
                        className="p-1 rounded hover:bg-gray-100"
                      >
                        <FaAngleLeft className="text-gray-600" />
                      </button>
                      <span className="text-sm font-semibold text-gray-700">
                        {date.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                        })}
                      </span>
                      <button
                        onClick={increaseMonth}
                        disabled={nextMonthButtonDisabled}
                        className="p-1 rounded hover:bg-gray-100"
                      >
                        <FaAngleRight className="text-gray-600" />
                      </button>
                    </div>
                  )}
                />
              </div>
            )}
          </div>

          <button
            onClick={navigateToNextPeriod}
            className="p-2 rounded-full bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          >
            <FaAngleRight size={16} />
          </button>
        </div>
      </div>

      {/* Timeline-style Attendance View */}
      <div className="bg-background rounded-xl shadow p-6 w-full overflow-x-auto">
        <div className="relative">
          {/* Timeline connector */}
          <div className="absolute left-16 top-0 h-full w-0.5 bg-gray-200 transform translate-x-1/2"></div>
          
          <div className="space-y-4">
            {weeklyData.map((day, index) => (
              <div 
                key={index} 
                className="relative flex items-start group transition-all duration-150"
              >
                {/* Timeline dot with pulse animation for today */}
                <div className={`absolute left-12 top-5 h-3 w-5 rounded-full transform translate-x-1/2 z-10 ${
                  day.status === "Present" ? "bg-green-500" :
                  day.status === "Absent" ? "bg-red-500" :
                  day.status === "Half Day" ? "bg-yellow-500" :
                  day.status === "Leave" ? "bg-blue-500" : "bg-purple-500"
                } ${new Date(day.fullDate).toDateString() === today.toDateString() ? "animate-pulse" : ""}`}></div>
                
                {/* Date/Day badge */}
                <div className="flex-shrink-0 w-16 text-center pt-1">
                  <div className={`text-sm text-text font-medium ${
                    day.dayName === 'Sat' || day.dayName === 'Sun' ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    {day.dayName}
                  </div>
                  <div className={`text-xl font-bold text-text ${
                    day.dayName === 'Sat' || day.dayName === 'Sun' ? 'text-blue-800' : 'text-gray-800'
                  } ${
                    new Date(day.fullDate).toDateString() === today.toDateString() ? 
                    "text-primary" : ""
                  }`}>
                    {day.date}
                  </div>
                </div>
                
                {/* Attendance card */}
                <div 
                  className={`flex-grow ml-6 p-4 bg-primary rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer ${
                    selectedDay === index ? 
                      "border-primary shadow-md bg-blue-50" : 
                      "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                  }`}
                  onClick={() => toggleDayDetails(index)}
                >
                  <div className="flex justify-between items-start">
                    <StatusBadge status={day.status} />
                    
                    {day.totalHours > 0 && (
                      <div className="text-lg font-bold text-gray-800 flex items-center">
                        <span className="text-sm font-normal text-text mr-1">Total:</span>
                        {day.totalHours} <span className="text-sm font-normal text-text ml-1">hrs</span>
                      </div>
                    )}
                  </div>
                  
                  {(day.checkIn || day.checkOut) && (
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-text">
                      {day.checkIn && (
                        <div className="flex items-center">
                          <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                          <span className="font-medium">In:</span> {day.checkIn}
                          {day.late && (
                            <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                              {day.late}
                            </span>
                          )}
                        </div>
                      )}
                      {day.checkOut && (
                        <div className="flex items-center">
                          <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                          <span className="font-medium">Out:</span> {day.checkOut}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {expandedView && (
                    <div className="mt-3 text-sm text-gray-600">
                      {day.notes && (
                        <div className="flex items-start">
                          <span className="text-text mr-2">•</span>
                          <span>{day.notes}</span>
                        </div>
                      )}
                      {day.status === "Present" && (
                        <div className="flex items-start mt-1">
                          <span className="text-text mr-2">•</span>
                          <span>Regular working day</span>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedDay === index && !expandedView && day.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded text-sm text-text border-t border-gray-200">
                      {day.notes}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div className="mt-6 bg-background rounded-xl shadow p-4">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm text-text">
              Present: {weeklyData.filter(d => d.status === "Present").length} days
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <span className="text-sm text-gray-600">
              Half Day: {weeklyData.filter(d => d.status === "Half Day").length} days
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            <span className="text-sm text-gray-600">
              Leave: {weeklyData.filter(d => d.status === "Leave").length} days
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span className="text-sm text-gray-600">
              Absent: {weeklyData.filter(d => d.status === "Absent").length} days
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
            <span className="text-sm text-gray-600">
              Holiday: {weeklyData.filter(d => d.status === "Holiday").length} days
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;