import React, { useState, useEffect } from "react";
import { IoCalendarNumberOutline } from "react-icons/io5";
import { FaAngleLeft, FaAngleRight, FaCheck, FaTimes, FaEye, FaDownload } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import timesheetApi from "../../api/timesheetApi";
import { toast } from "react-toastify";

const ApproveTimesheets = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [selectedTimesheet, setSelectedTimesheet] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Get month and year from selected date
  const getMonthYear = (date) => {
    return {
      month: date.getMonth() + 1,
      year: date.getFullYear()
    };
  };

  // Fetch timesheets for selected month/year
  const fetchTimesheets = async () => {
    setLoading(true);
    try {
      const { month, year } = getMonthYear(selectedDate);
      const response = await timesheetApi.getAllTimesheets(month, year);
      setTimesheets(response);
    } catch (error) {
      console.error("Failed to fetch timesheets:", error);
      toast.error("Failed to load timesheets");
    } finally {
      setLoading(false);
    }
  };

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
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const handleStatusChange = async (timesheetId, status, approvedHours = null) => {
    setUpdating(true);
    try {
      const updateData = { status };
      if (approvedHours !== null) {
        updateData.approvedHours = approvedHours;
      }

      await timesheetApi.updateTimesheetStatus(timesheetId, updateData);
      
      // Update local state
      setTimesheets(prev => prev.map(ts => 
        ts._id === timesheetId 
          ? { ...ts, status, approvedHours: approvedHours !== null ? approvedHours : ts.approvedHours }
          : ts
      ));
      
      toast.success(`Timesheet ${status.toLowerCase()} successfully`);
    } catch (error) {
      console.error("Failed to update timesheet:", error);
      toast.error("Failed to update timesheet");
    } finally {
      setUpdating(false);
    }
  };

  const handleViewDetails = async (timesheet) => {
    try {
      const detailedTimesheet = await timesheetApi.getTimesheetById(timesheet._id);
      setSelectedTimesheet(detailedTimesheet);
      setShowDetails(true);
    } catch (error) {
      console.error("Failed to fetch timesheet details:", error);
      toast.error("Failed to load timesheet details");
    }
  };

  const handleDownloadAttachment = (attachment) => {
    window.open(attachment.url, '_blank');
  };

  const totalSubmitted = timesheets.reduce((sum, sheet) => sum + (sheet.submittedHours || 0), 0);
  const totalApproved = timesheets.reduce((sum, sheet) => sum + (sheet.approvedHours || 0), 0);

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-gray-800">Approve Timesheets</h2>

          <div className="flex items-center gap-3">
            <button
              onClick={navigateToPreviousMonth}
              className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              disabled={loading}
            >
              <FaAngleLeft size={16} />
            </button>

            <div className="relative">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors"
                onClick={() => setShowCalendar(!showCalendar)}
                disabled={loading}
              >
                <IoCalendarNumberOutline size={20} />
                <span className="text-sm">{formatDate(selectedDate)}</span>
              </button>

              {showCalendar && (
                <div className="absolute z-50 mt-2 bg-white shadow-xl rounded-lg border">
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
              className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              disabled={loading}
            >
              <FaAngleRight size={16} />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <span className="text-sm text-gray-600">
              Submitted: <strong>{totalSubmitted.toFixed(2)}h</strong>
            </span>
            <span className="text-sm text-gray-600">
              Approved: <strong>{totalApproved.toFixed(2)}h</strong>
            </span>
          </div>
        </div>

        {/* Timesheets Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDate.getTime()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {loading ? (
                <div className="text-center p-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-3 text-gray-600">Loading timesheets...</p>
                </div>
              ) : timesheets.length === 0 ? (
                <div className="text-center p-12">
                  <p className="text-gray-500">No timesheets found for {formatDate(selectedDate)}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-700">
                      <tr>
                        {[
                          "Employee",
                          "Timesheet Name",
                          "Date",
                          "Submitted Hours",
                          "Approved Hours",
                          "Status",
                          "Actions",
                        ].map((heading) => (
                          <th
                            key={heading}
                            className="px-6 py-4 font-semibold border-b border-gray-200"
                          >
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {timesheets.map((timesheet) => (
                        <tr
                          key={timesheet._id}
                          className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">{timesheet.employeeName}</td>
                          <td className="px-6 py-4 font-medium">{timesheet.name}</td>
                          <td className="px-6 py-4">
                            {new Date(timesheet.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">{timesheet.submittedHours}</td>
                          <td className="px-6 py-4">{timesheet.approvedHours}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                timesheet.status
                              )}`}
                            >
                              {timesheet.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleViewDetails(timesheet)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="View Details"
                                disabled={updating}
                              >
                                <FaEye size={14} />
                              </button>
                              <button
                                onClick={() => handleStatusChange(timesheet._id, "Approved", timesheet.submittedHours)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Approve"
                                disabled={updating || timesheet.status === "Approved"}
                              >
                                <FaCheck size={14} />
                              </button>
                              <button
                                onClick={() => handleStatusChange(timesheet._id, "Rejected", 0)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Reject"
                                disabled={updating || timesheet.status === "Rejected"}
                              >
                                <FaTimes size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Timesheet Details Modal */}
        {showDetails && selectedTimesheet && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-800">
                    Timesheet Details - {selectedTimesheet.name}
                  </h3>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Employee
                    </label>
                    <p className="text-gray-900">{selectedTimesheet.employeeName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <p className="text-gray-900">
                      {new Date(selectedTimesheet.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Submitted Hours
                    </label>
                    <p className="text-gray-900">{selectedTimesheet.submittedHours}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        selectedTimesheet.status
                      )}`}
                    >
                      {selectedTimesheet.status}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">
                    {selectedTimesheet.description || "No description provided"}
                  </p>
                </div>

                {/* Time Logs */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Time Logs ({selectedTimesheet.timeLogs?.length || 0})
                  </label>
                  <div className="space-y-3">
                    {selectedTimesheet.timeLogs?.map((log) => (
                      <div key={log._id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <strong>Job:</strong> {log.job}
                          </div>
                          <div>
                            <strong>Hours:</strong> {log.hours}
                          </div>
                          <div>
                            <strong>Date:</strong>{" "}
                            {new Date(log.date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="mt-2">
                          <strong>Description:</strong> {log.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Attachments */}
                {selectedTimesheet.attachments?.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Attachments
                    </label>
                    <div className="space-y-2">
                      {selectedTimesheet.attachments.map((attachment, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                        >
                          <span className="text-sm text-gray-700">
                            {attachment.originalname}
                          </span>
                          <button
                            onClick={() => handleDownloadAttachment(attachment)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Download"
                          >
                            <FaDownload size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                {selectedTimesheet.status !== "Approved" && (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedTimesheet._id, "Approved", selectedTimesheet.submittedHours);
                      setShowDetails(false);
                    }}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Approve Timesheet
                  </button>
                )}
                {selectedTimesheet.status !== "Rejected" && (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedTimesheet._id, "Rejected", 0);
                      setShowDetails(false);
                    }}
                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Reject Timesheet
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ApproveTimesheets;