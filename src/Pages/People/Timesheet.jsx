import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoCalendarNumberOutline } from "react-icons/io5";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Timesheet = ({ timesheets, fetchTimesheets }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calendarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar]);

  useEffect(() => {
    const loadTimesheets = async () => {
      setLoading(true);
      try {
        const month = selectedDate.getMonth() + 1;
        const year = selectedDate.getFullYear();
        await fetchTimesheets(month, year);
      } catch (error) {
        console.error("Error loading timesheets:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTimesheets();
  }, [selectedDate]);

  const navigateToPreviousMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setSelectedDate(newDate);
  };

  const navigateToNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setSelectedDate(newDate);
  };

  const formatDate = (date) => {
    return date
      ? date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        })
      : "";
  };

  const totalSubmitted = timesheets.reduce(
    (sum, sheet) => sum + (sheet.submittedHours || 0),
    0
  );

  return (
    <>
      {/* Header Card */}
      <div className="bg-white/90 backdrop-blur-sm rounded-[1.2rem] shadow-md border border-white/50 mb-4 p-2 relative z-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-base font-bold text-slate-800 uppercase tracking-tight">Timesheets</h2>

          <div className="flex flex-row items-center gap-3">
            <button
              onClick={navigateToPreviousMonth}
              className="p-2.5 rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 transition shadow-sm"
            >
              <FaAngleLeft size={18} />
            </button>

            <div className="relative" ref={calendarRef}>
              <button
                className="px-3 py-2 text-blue-800 bg-blue-100 rounded-lg flex items-center gap-2 hover:bg-blue-200 transition shadow-sm text-sm font-medium"
                onClick={() => setShowCalendar(!showCalendar)}
              >
                <IoCalendarNumberOutline size={18} />
                {selectedDate && (
                  <span className="text-sm font-medium">{formatDate(selectedDate)}</span>
                )}
              </button>

              <AnimatePresence>
                {showCalendar && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-50 mt-2 bg-white/95 backdrop-blur-sm shadow-lg rounded-xl border border-white/50"
                  >
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => {
                        setSelectedDate(date);
                        setShowCalendar(false);
                      }}
                      dateFormat="MM/yyyy"
                      showMonthYearPicker
                      inline
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={navigateToNextMonth}
              className="p-2.5 rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 transition shadow-sm"
            >
              <FaAngleRight size={18} />
            </button>
          </div>

          <div className="bg-blue-50 px-3 py-2 rounded-lg shadow-sm">
            <span className="text-xs font-medium text-slate-800 uppercase tracking-wide">
              Submitted Hours: <span className="font-bold text-slate-800">{totalSubmitted.toFixed(2)}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Timesheet Table */}
      <div className="bg-white/90 backdrop-blur-sm rounded-[1.2rem] shadow-md border border-white/50 p-4 overflow-x-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDate ? selectedDate.getTime() : "all"}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {loading && (
              <div className="text-center p-6">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
                <p className="mt-3 text-slate-600 text-xs font-medium uppercase tracking-wide">Loading timesheets...</p>
              </div>
            )}
            {error && (
              <div className="text-red-500 p-4 text-center text-sm bg-red-50 rounded-lg">
                {error}
              </div>
            )}
            {!loading && !error && (
              <table className="min-w-full text-sm border-separate border-spacing-0">
                <thead>
                  <tr className="bg-slate-100/80 backdrop-blur-sm text-slate-800">
                    {[
                      "Timesheet Name",
                      "Employee",
                      "Submitted Hours",
                      "Approved Hours",
                      "Status",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="p-4 font-semibold text-xs uppercase tracking-wide border-b border-slate-200 text-left"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timesheets.length ? (
                    timesheets.map((item) => (
                      <tr
                        key={item._id}
                        className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors cursor-pointer"
                      >
                        <td className="p-4 text-slate-700 font-medium">{item.name}</td>
                        <td className="p-4 text-slate-700">{item.employeeName}</td>
                        <td className="p-4 text-slate-700 font-medium">{item.submittedHours}</td>
                        <td className="p-4 text-slate-700 font-medium">{item.approvedHours}</td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-wide ${
                              item.status === "Approved"
                                ? "bg-green-100 text-green-800"
                                : item.status === "Rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-8 text-center text-slate-500 text-sm"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                          </svg>
                          <p className="text-sm font-medium text-slate-500">
                            No timesheets found for {formatDate(selectedDate)}
                          </p>
                          <p className="text-xs text-slate-400">Try selecting a different month</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};

export default Timesheet;