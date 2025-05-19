import React, { useState } from "react";
import { IoCalendarNumberOutline } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { FaCheck } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ApproveTimelogs = () => {
  const timeSheets = [
    {
      id: "current",
      data: [
        { name: "Alice", date: "10-02-2024", checkinTime: "3:00 PM", checkoutTime: "10:00 PM", totalHours: "7", status: "Approved" },
        { name: "Bob", date: "11-02-2024", checkinTime: "2:00 PM", checkoutTime: "10:00 PM", totalHours: "8", status: "Approved" },
        { name: "Carol", date: "12-02-2024", checkinTime: "4:00 PM", checkoutTime: "10:00 PM", totalHours: "6", status: "Denied" },
      ]
    },
    {
      id: "previous",
      data: [
        { name: "Alice", date: "02-01-2025", checkinTime: "2:00 PM", checkoutTime: "10:00 PM", totalHours: "8", status: "Approved" },
        { name: "Bob", date: "05-01-2025", checkinTime: "4:00 PM", checkoutTime: "10:00 PM", totalHours: "6", status: "Denied" },
      ]
    }
  ];

  const [activeSheet, setActiveSheet] = useState("current");
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [editableRows, setEditableRows] = useState({});

  const handleNavigation = (direction) => {
    setActiveSheet(direction === "previous" ? "previous" : "current");
  };

  const parseDate = (dateStr) => {
    const [dd, mm, yyyy] = dateStr.split("-");
    return new Date(`${yyyy}-${mm}-${dd}`);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-GB").split("/").join("-");
  };

  const currentData = timeSheets.find(sheet => sheet.id === activeSheet)?.data || [];
  const [data, setData] = useState(currentData);

  const filteredData = selectedDate
    ? data.filter((item) => formatDate(parseDate(item.date)) === formatDate(selectedDate))
    : data;

  const handleEdit = (index) => {
    setEditableRows({ ...editableRows, [index]: true });
  };

  const handleSave = (index, newHours) => {
    const updatedData = [...data];
    updatedData[index].totalHours = newHours;
    setData(updatedData);
    setEditableRows({ ...editableRows, [index]: false });
  };

  const handleStatusChange = (index, newStatus) => {
    const updatedData = [...data];
    updatedData[index].status = newStatus;
    setData(updatedData);
  };

  return (
    <div className="min-h-screen bg-[#dce3f0] p-4 m-6 rounded-lg shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 bg-primary p-4 rounded-md m-6">
        <div className="mx-4">
          <h2 className="text-lg font-semibold text-white">Approve Timelogs</h2>
        </div>

        <div className="flex items-center gap-4 mx-4">
          <button className={`px-2 py-1 rounded ${activeSheet === "previous" ? "bg-background text-heading" : "bg-gray-200"}`} onClick={() => handleNavigation("previous")}>{'<'}</button>

          <div className="relative">
            <button className="px-2 py-1 bg-gray-200 rounded" onClick={() => setShowCalendar(!showCalendar)}>
              <IoCalendarNumberOutline size={20} />
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

          <button className={`px-2 py-1 rounded ${activeSheet === "current" ? "bg-background text-heading" : "bg-gray-200"}`} onClick={() => handleNavigation("current")}>{'>'}</button>
        </div>

        <div className="mx-4">
          <span className="text-sm text-white">Submitted Hours | 00:00</span>
        </div>
      </div>

      {/* Table */}
      <div className="relative m-6 overflow-hidden rounded-md bg-gray-100 min-h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSheet + (selectedDate?.toString() || "")}
            initial={{ x: activeSheet === "current" ? 300 : -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: activeSheet === "current" ? -300 : 300, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute w-full"
          >
            <table className="w-full text-center text-sm bg-background">
              <thead className="text-heading">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Checkin</th>
                  <th className="px-4 py-2">Checkout</th>
                  <th className="px-4 py-2">Hours</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-primary text-white" : "bg-background"}>
                    <td className="p-3">{item.name}</td>
                    <td className="p-3">{item.date}</td>
                    <td className="p-3">{item.checkinTime}</td>
                    <td className="p-3">{item.checkoutTime}</td>
                    <td className="p-3">
                      {editableRows[index] ? (
                        <input
                          type="number"
                          defaultValue={item.totalHours}
                          className="w-16 p-1 rounded text-black"
                          onBlur={(e) => handleSave(index, e.target.value)}
                        />
                      ) : (
                        item.totalHours
                      )}
                    </td>
                    <td className="p-3 flex justify-center gap-3">
                      <FiEdit
                        size={18}
                        className="cursor-pointer text-blue-600 hover:scale-110"
                        onClick={() => handleEdit(index)}
                        title="Edit Hours"
                      />
                      <FaCheck
                        size={18}
                        className="cursor-pointer text-green-600 hover:scale-110"
                        onClick={() => handleStatusChange(index, "Approved")}
                        title="Approve"
                      />
                      <MdCancel
                        size={20}
                        className="cursor-pointer text-red-600 hover:scale-110"
                        onClick={() => handleStatusChange(index, "Denied")}
                        title="Decline"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ApproveTimelogs;
