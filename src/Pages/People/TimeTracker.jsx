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

const TimeTracker = () => {
  const [isAddTimeLogModalOpen, setIsAddTimeLogModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add or edit
  const [editingLogIndex, setEditingLogIndex] = useState(null);
  const [viewingLog, setViewingLog] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const [timeLogs, setTimeLogs] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [showCalendar, setShowCalendar] = useState(false);

  const parseDate = (dateStr) => {
    const [dd, mm, yyyy] = dateStr.split("-");
    return new Date(`${yyyy}-${mm}-${dd}`);
  };

  const filteredData = timeLogs.filter((item) => {
    const itemDate = parseDate(item.date);
    if (startDate && endDate) {
      return itemDate >= startDate && itemDate <= endDate;
    }
    return true;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [dateRange, timeLogs]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const paginatedData =
    filteredData.length <= rowsPerPage
      ? filteredData
      : filteredData.slice(
          (currentPage - 1) * rowsPerPage,
          currentPage * rowsPerPage
        );

  const handleSaveLogs = (newLogs) => {
    const formattedLogs = newLogs.map((log) => ({
      jobTitle: log.jobTitle,
      date: log.date,
      description: log.description,
      totalHours: log.hours,
      attachmentName: log.attachmentName,
      status: "Pending",
    }));

    if (modalMode === "add") {
      setTimeLogs((prev) => [...prev, ...formattedLogs]);
    } else if (modalMode === "edit" && editingLogIndex !== null) {
      const updatedLogs = [...timeLogs];
      updatedLogs[editingLogIndex] = {
        ...formattedLogs[0],
        status: timeLogs[editingLogIndex].status, // keep status
      };
      setTimeLogs(updatedLogs);
    }

    setIsAddTimeLogModalOpen(false);
    setEditingLogIndex(null);
    setModalMode("add");
  };

  const handleDelete = (index) => {
    const updated = [...timeLogs];
    updated.splice(index, 1);
    setTimeLogs(updated);
  };

  return (
    <>
      <SubNavbar
        onAddTimeLog={() => {
          setModalMode("add");
          setEditingLogIndex(null);
          setIsAddTimeLogModalOpen(true);
        }}
      />
      <div className="min-h-screen bg-primary p-4 m-6 rounded-lg shadow-md">
        {/* Header */}
        <div className="flex flex-col bg-background w-full sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 bg-white p-4 rounded-md">
          <h2 className="text-text sm:text-lg text-black mx-4">Time Tracker</h2>

          <div className="flex flex-wrap items-center gap-3 mx-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-primary text-white"
              }`}
            >
              <FaAngleLeft size={16} />
            </button>

            <div className="relative">
              <button
                className="px-2 py-1 bg-primary rounded"
                onClick={() => setShowCalendar(!showCalendar)}
              >
                <IoCalendarNumberOutline size={20} />
              </button>

              {showCalendar && (
                <div className="absolute z-50 mt-2 bg-white shadow-lg rounded">
                  <DatePicker
                    selectsRange
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update) => {
                      setDateRange(update);
                      if (update[1]) setShowCalendar(false);
                    }}
                    inline
                  />
                </div>
              )}
            </div>

            <button
              onClick={() =>
                setCurrentPage((p) => (p < totalPages ? p + 1 : p))
              }
              disabled={currentPage >= totalPages}
              className={`px-3 py-1 rounded ${
                currentPage >= totalPages
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-primary text-white"
              }`}
            >
              <FaAngleRight size={16} />
            </button>
          </div>
          <div className="mx-4">
            <span className="text-sm text-text">Submitted Hours | 00:00</span>
          </div>
        </div>
        {/* Table */}
        <div className="bg-background rounded-xl shadow p-4 w-full overflow-x-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={JSON.stringify(dateRange) + currentPage}
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
                      "Status",
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
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-3">{item.jobTitle || "-"}</td>
                        <td className="p-3">{item.date}</td>
                        <td className="p-3">{item.description}</td>
                        <td className="p-3">{item.totalHours}</td>
                        <td className="p-3">{item.attachmentName || "-"}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              item.status === "Approved"
                                ? "bg-green-100 text-green-700"
                                : item.status === "Denied"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="p-3 flex gap-2">
                          <button
                            onClick={() => setViewingLog(item)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <IoEye />
                          </button>
                          <button
                            onClick={() => {
                              setEditingLogIndex(index);
                              setModalMode("edit");
                              setIsAddTimeLogModalOpen(true);
                            }}
                            className="text-green-600 hover:text-green-800"
                          >
                            <IoPencil />
                          </button>
                          <button
                            onClick={() => handleDelete(index)}
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
                        No records found for selected range
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      {/* Add Modal */}
      <AddTimeLogModal
        isOpen={modalMode === "add" && isAddTimeLogModalOpen}
        onClose={() => setIsAddTimeLogModalOpen(false)}
        onSave={handleSaveLogs}
      />
      {/* Add/Edit Modal */}
      <EditTimeLogModal
        isOpen={modalMode === "edit" && isAddTimeLogModalOpen}
        onClose={() => setIsAddTimeLogModalOpen(false)}
        onSave={handleSaveLogs}
        initialData={timeLogs[editingLogIndex]}
      />
      {/* View Modal */}
      <ViewTimeLogModal log={viewingLog} onClose={() => setViewingLog(null)} />
    </>
  );
};

export default TimeTracker;
