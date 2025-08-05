import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoCalendarNumberOutline } from "react-icons/io5";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import timesheetApi from "../../api/timesheetApi";
import { toast } from "react-toastify";

const Timesheet = ({ timesheets, fetchTimesheets }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // const fetchTimesheets = async () => {
  //   try {
  //     setLoading(true);
  //     const month = selectedDate.getMonth() + 1;
  //     const year = selectedDate.getFullYear();
  //     const response = await timesheetApi.getEmployeeTimesheets(month, year);
  //     setTimesheets(response);
  //     setError(null);
  //   } catch (err) {
  //     setError(err.response?.data?.message || "Failed to load timesheets");
  //     toast.error("Failed to load timesheets");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    fetchTimesheets();
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
      <div className="flex flex-col bg-background w-full sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 bg-white p-4 rounded-md">
        <h2 className="text-text sm:text-lg text-black mx-4">Timesheets</h2>

        <div className="flex flex-row items-center gap-3 mx-4 whitespace-nowrap">
          <button
            onClick={navigateToPreviousMonth}
            className="px-3 py-1 rounded bg-primary text-white hover:bg-primary-dark"
          >
            <FaAngleLeft size={16} />
          </button>

          <div className="relative">
            <button
              className="px-2 py-1 text-white bg-primary rounded flex items-center gap-2 hover:bg-primary-dark sm:px-3 sm:py-2"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              <IoCalendarNumberOutline size={20} />
              {selectedDate && (
                <span className="text-sm">{formatDate(selectedDate)}</span>
              )}
            </button>

            {showCalendar && (
              <div className="absolute z-50 mt-2 bg-white shadow-lg rounded">
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
              </div>
            )}
          </div>

          <button
            onClick={navigateToNextMonth}
            className="px-3 py-1 rounded bg-primary text-white hover:bg-primary-dark"
          >
            <FaAngleRight size={16} />
          </button>
        </div>

        <div className="mx-4">
          <span className="text-sm text-text">
            Submitted Hours | {totalSubmitted.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="bg-background rounded-xl shadow p-4 w-full overflow-x-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDate ? selectedDate.getTime() : "all"}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {loading && (
              <div className="text-center p-4">Loading timesheets...</div>
            )}
            {error && (
              <div className="text-red-500 p-4 text-center">{error}</div>
            )}
            {!loading && !error && (
              <table className="min-w-full text-sm text-left border-separate border-spacing-0">
                <thead className="bg-primary text-white">
                  <tr>
                    {[
                      "Timesheet Name",
                      "Employee",
                      "Submitted Hours",
                      "Approved Hours",
                      "Status",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="p-3 font-medium border-r last:border-none border-gray-300"
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
                        className="border-b hover:bg-gray-50 cursor-pointer"
                      >
                        <td className="p-3">{item.name}</td>
                        <td className="p-3">{item.employeeName}</td>
                        <td className="p-3">{item.submittedHours}</td>
                        <td className="p-3">{item.approvedHours}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
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
                        className="p-4 text-center text-gray-500"
                      >
                        No timesheets found for {formatDate(selectedDate)}.
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