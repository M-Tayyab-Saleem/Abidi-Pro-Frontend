import React, { useState, useEffect } from "react";
import SubNavbar from "../../Components/PeopleSubNavbar";
import AddTimeLogModal from "../People/AddTimeLogModal";
import {
  IoCalendarNumberOutline,
  IoEye,
  IoPencil,
  IoTrash,
} from "react-icons/io5";
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { AnimatePresence, motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import EditTimeLogModal from "./EditTimeLogModal";
import ViewTimeLogModal from "./ViewTimeLogModal";
import timeLogApi from "../../api/timeLogApi";
import { toast } from "react-toastify";
import Timesheet from "./Timesheet";
import CreateTimesheetModal from "./CreateTimesheetModal";
import timesheetApi from "../../api/timesheetApi";

const TimeTracker = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isAddTimeLogModalOpen, setIsAddTimeLogModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [editingLogId, setEditingLogId] = useState(null);
  const [viewingLog, setViewingLog] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const [timeLogs, setTimeLogs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCreateTimesheetModalOpen, setIsCreateTimesheetModalOpen] = useState(false);
  const [timesheets, setTimesheets] = useState([]);


  const tabs = [
    { title: "Time Logs" },
    { title: "Timesheets" },
  ];

  const fetchTimeLogs = async () => {
    try {
      setLoading(true);
      const response = await timeLogApi.getEmployeeTimeLogs();
      setTimeLogs(response);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load time logs");
      toast.error("Failed to load time logs");
    } finally {
      setLoading(false);
    }
  };

  const fetchTimesheets = async () => {
    try {
      const today = new Date();
      const month = today.getMonth() + 1;
      const year = today.getFullYear();
      const response = await timesheetApi.getEmployeeTimesheets(month, year);
      setTimesheets(response);
    } catch (error) {
      console.error("Failed to fetch timesheets:", error);
      toast.error("Failed to load timesheets");
    }
  };

  useEffect(() => {
    if (activeTab === 0) {
      fetchTimeLogs();
    }
  }, [activeTab]);



  const parseDate = (dateStr) => {
    if (!dateStr) return new Date();
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? new Date() : date;
  };

  const filteredData = selectedDate
    ? timeLogs.filter(item => {
      const itemDate = parseDate(item.date);
      return (
        itemDate.getDate() === selectedDate.getDate() &&
        itemDate.getMonth() === selectedDate.getMonth() &&
        itemDate.getFullYear() === selectedDate.getFullYear()
      );
    })
    : timeLogs;

  const totalHours = filteredData.reduce((sum, log) => sum + (log.hours || 0), 0);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDate, timeLogs]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.length <= rowsPerPage
    ? filteredData
    : filteredData.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    );

  const handleSaveLogs = async (newLogs) => {
    try {
      if (modalMode === "add") {
        for (const log of newLogs) {
          const formData = new FormData();
          formData.append('job', log.jobTitle);
          formData.append('date', log.date);
          formData.append('hours', log.totalHours);
          formData.append('description', log.description);
          if (log.attachment) {
            formData.append('attachments', log.attachment);
          }
          await timeLogApi.createTimeLog(formData);
        }
      } else if (modalMode === "edit" && editingLogId) {
        const log = newLogs[0];
        const formData = new FormData();
        formData.append('job', log.jobTitle);
        formData.append('date', log.date);
        formData.append('hours', log.totalHours);
        formData.append('description', log.description);
        if (log.attachment) {
          formData.append('attachments', log.attachment);
        }
        await timeLogApi.updateTimeLog(editingLogId, formData);
      }

      await fetchTimeLogs();
      setIsAddTimeLogModalOpen(false);
      setEditingLogId(null);
      setModalMode("add");
      toast.success("Time log saved successfully");
    } catch (error) {
      console.error("Failed to save time log:", error);
      toast.error(error.response?.data?.message || "Failed to save time log");
    }
  };

  const handleDelete = async (id) => {
    try {
      await timeLogApi.deleteTimeLog(id);
      fetchTimeLogs();
      toast.success("Time log deleted successfully");
    } catch (error) {
      console.error("Failed to delete time log:", error);
      toast.error(error.response?.data?.message || "Failed to delete time log");
    }
  };

  const handleViewLog = (log) => {
    setViewingLog({
      ...log,
      jobTitle: log.job,
      totalHours: log.hours,
      attachmentName: log.attachments?.[0]?.filename
    });
  };

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : '';
  };

  const navigateToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const navigateToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  return (
    <>
      <SubNavbar
        onAddTimeLog={() => {
          setModalMode("add");
          setEditingLogId(null);
          setIsAddTimeLogModalOpen(true);
        }}
        activeTab={activeTab}
        onCreateTimesheet={() => setIsCreateTimesheetModalOpen(true)}
      />

      <div className="min-h-screen bg-primary p-4 m-6 rounded-lg shadow-md">
        {/* Tab Bar */}
        <div className="inline-flex flex-row flex-wrap items-center justify-center bg-white p-1 rounded-lg shadow-sm border border-gray-200 mb-4">
          {tabs.map((item, index) => (
            <div key={item.title} className="flex items-center">
              <button
                className={`px-4 py-2  text-sm font-medium transition-colors duration-200
                ${activeTab === index
                     ? "text-heading  rounded-md bg-gray-100"
                    : "text-primary hover:text-primary hover:bg-gray-100 rounded-md"
                  }`}
                onClick={() => setActiveTab(index)}
              >
                {item.title}
              </button>
              {index !== tabs.length - 1 && (
                <span className="w-px h-4 bg-gray-300 mx-1"></span>
              )}
            </div>
          ))}
        </div>

        {activeTab === 0 && (
          <>
            <div className="flex flex-col bg-background w-full sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 bg-white p-4 rounded-md">
              <h2 className="text-text sm:text-lg text-black mx-4">Time Logs</h2>

              <div className="flex flex-wrap items-center gap-3 mx-4">
                <button
                  onClick={navigateToPreviousDay}
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
                        inline
                      />
                    </div>
                  )}
                </div>

                <button
                  onClick={navigateToNextDay}
                  className="px-3 py-1 rounded bg-primary text-white hover:bg-primary-dark"
                >
                  <FaAngleRight size={16} />
                </button>
              </div>
              <div className="mx-4">
                <span className="text-sm text-text">
                  Submitted Hours | {totalHours.toFixed(2)}
                </span>
              </div>
            </div>

            {loading && (
              <div className="text-center p-4">Loading time logs...</div>
            )}
            {error && (
              <div className="text-red-500 p-4 text-center">{error}</div>
            )}

            {!loading && !error && (
              <div className="bg-background rounded-xl shadow p-4 w-full overflow-x-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedDate ? selectedDate.getTime() : 'all'}
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <table className="min-w-full text-sm text-left border-separate border-spacing-0">
                      <thead className="bg-primary text-white">
                        <tr>
                          {[
                            "Job Title",
                            "Date",
                            "Description",
                            "Hours",
                            "Attachment",
                            "Actions",
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
                        {paginatedData.length ? (
                          paginatedData.map((item, index) => (
                            <tr key={item._id} className="border-b hover:bg-gray-50 cursor-pointer" >
                              <td className="p-3" onClick={() => handleViewLog(item)}>{item.job || "-"}</td>
                              <td className="p-3" onClick={() => handleViewLog(item)}>{new Date(item.date).toLocaleDateString()}</td>
                              <td className="p-3" onClick={() => handleViewLog(item)}>{item.description}</td>
                              <td className="p-3" onClick={() => handleViewLog(item)}>{item.hours}</td>
                              <td className="p-3" onClick={() => handleViewLog(item)}>{item.attachments?.[0]?.originalname || "-"}</td>
                              <td className="p-3 flex gap-2">
                                <button
                                  onClick={() => handleViewLog(item)}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <IoEye />
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingLogId(item._id);
                                    setModalMode("edit");
                                    setIsAddTimeLogModalOpen(true);
                                  }}
                                  className="text-green-600 hover:text-green-800"
                                >
                                  <IoPencil />
                                </button>
                                <button
                                  onClick={() => handleDelete(item._id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <IoTrash />
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="p-4 text-center text-gray-500">
                              {selectedDate
                                ? `No time logs found for ${formatDate(selectedDate)}`
                                : "No time logs found"}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </>
        )}
        {activeTab === 1 && <Timesheet timesheets={timesheets} fetchTimesheets={fetchTimesheets} />
        }
      </div>

      <AddTimeLogModal
        isOpen={modalMode === "add" && isAddTimeLogModalOpen}
        onClose={() => setIsAddTimeLogModalOpen(false)}
        onSave={handleSaveLogs}
        onTimeLogAdded={fetchTimeLogs}
      />
<CreateTimesheetModal
  open={isCreateTimesheetModalOpen}
  onClose={() => setIsCreateTimesheetModalOpen(false)}
  onTimesheetCreated={fetchTimesheets} 
/>

      <EditTimeLogModal
        isOpen={modalMode === "edit" && isAddTimeLogModalOpen}
        onClose={() => {
          setIsAddTimeLogModalOpen(false);
          setEditingLogId(null);
        }}
        onTimeLogUpdated={fetchTimeLogs}
        timeLogId={editingLogId}
        initialData={timeLogs.find(log => log._id === editingLogId)}
      />

      {viewingLog && (
        <ViewTimeLogModal
          key={viewingLog._id}
          log={viewingLog}
          onClose={() => setViewingLog(null)}
        />
      )}
    </>
  );
};

export default TimeTracker;