import React, { useState, useEffect, useRef } from "react";
import timesheetApi from "../../api/timesheetApi";
import timeLogApi from "../../api/timeLogApi";
import { toast } from "react-toastify";

export default function CreateTimesheetModal({ open, onClose, onTimesheetCreated }) {
  const [timesheetName, setTimesheetName] = useState("");
  const [selectedDate, setSelectedDate] = useState(""); // State for the chosen date
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingLogs, setFetchingLogs] = useState(false);
  const modalRef = useRef(null);

  // Helper to format date for the Timesheet Name (MM-DD-YYYY)
  const formatNameDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-"); // Input is YYYY-MM-DD
    return `${month}-${day}-${year}`;
  };

  // Get today's date string in YYYY-MM-DD for defaults and max restriction
  const getTodayString = () => {
    const d = new Date();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (open) {
      const todayStr = getTodayString();
      setSelectedDate(todayStr);
      setDescription("");
      setAttachment(null);
      setLogs([]);
      // Fetching will be triggered by the selectedDate useEffect below
    }
  }, [open]);

  // Refetch logs and update name whenever selectedDate changes
  useEffect(() => {
    if (open && selectedDate) {
      setTimesheetName(`Timesheet (${formatNameDate(selectedDate)})`);
      fetchLogsForDate(selectedDate);
    }
  }, [selectedDate, open]);

  const fetchLogsForDate = async (dateStr) => {
    try {
      setFetchingLogs(true);
      // Pass the selected specific date to the API
      const response = await timeLogApi.getEmployeeTimeLogs(dateStr);
      const availableLogs = response.filter(log => !log.isAddedToTimesheet);
      setLogs(availableLogs);
      
      if (availableLogs.length === 0) {
        // Optional: toast.info(`No available logs found for ${dateStr}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load time logs");
    } finally {
      setFetchingLogs(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
  };

  const isValid = timesheetName.trim().length >= 3 && description.trim().length >= 5 && logs.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', timesheetName);
      formData.append('description', description);
      // Send the date to backend if needed, or backend infers it. 
      // Usually timesheet date is creation date, but if you need to backdate the timesheet record itself:
      // formData.append('date', selectedDate); 
      
      if (attachment) formData.append('attachments', attachment);
      logs.forEach(log => formData.append('timeLogs', log._id));

      await timesheetApi.createTimesheet(formData);
      toast.success("Timesheet created successfully!");
      onTimesheetCreated();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create timesheet");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex justify-center items-center p-4 sm:p-6"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="w-full max-w-lg bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl relative flex flex-col max-h-[90vh] animate-fadeIn overflow-hidden"
      >
        {/* Close Cross */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-6 w-10 h-10 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-50 hover:text-red-500 transition-all text-2xl font-light z-10"
        >
          &times;
        </button>

        <div className="px-6 py-6 sm:px-10 sm:py-8 border-b border-slate-50 text-center flex-shrink-0">
          <h2 className="text-base sm:text-lg font-black text-slate-800 tracking-widest uppercase">
            CREATE TIMESHEET
          </h2>
        </div>

        <form
          className="p-6 sm:p-10 space-y-5 sm:space-y-6 overflow-y-auto custom-scrollbar"
          onSubmit={handleSubmit}
        >
          {/* Date Selection */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">
              SELECT DATE
            </label>
            <input
              type="date"
              value={selectedDate}
              max={getTodayString()} // Restrict future dates
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 font-medium"
            />
          </div>

          {/* Logs Section */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">
              TIME LOGS ({selectedDate ? formatNameDate(selectedDate) : '...'})
            </label>
            {fetchingLogs ? (
              <div className="text-center p-4 text-xs font-bold text-slate-400 animate-pulse">FETCHING...</div>
            ) : logs.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400 italic">
                No time logs found for this date.
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {logs.map((log) => (
                  <div key={log._id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-black text-slate-700 uppercase tracking-tighter">{log.job || log.jobTitle}</span>
                      <span className="font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">{log.hours} HRS</span>
                    </div>
                    <p className="text-slate-400 line-clamp-1">{log.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Timesheet Name */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">
              TIMESHEET NAME
            </label>
            <input
              type="text"
              value={timesheetName}
              readOnly
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm text-slate-500 font-bold outline-none cursor-default"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">
              SUMMARY DESCRIPTION*
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all placeholder:text-slate-300 min-h-[100px]"
              placeholder="e.g. today's progress summary"
              required
            />
          </div>

          {/* Attachment */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">
              ATTACHMENT
            </label>
            <div className="relative group">
              <input
                type="file"
                onChange={(e) => setAttachment(e.target.files[0])}
                className="w-full opacity-0 absolute inset-0 cursor-pointer z-10"
              />
              <div className="w-full bg-white border border-slate-200 border-dashed rounded-xl px-4 py-3 text-sm text-slate-400 flex items-center justify-between group-hover:bg-slate-50 transition-all">
                <span className="truncate">{attachment ? attachment.name : "Choose a file..."}</span>
                <span className="text-[10px] font-black text-slate-300">UPLOAD</span>
              </div>
            </div>
          </div>
        </form>

        <div className="px-6 py-6 sm:px-10 sm:py-8 border-t border-slate-100 flex gap-3 sm:gap-4 bg-white flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 sm:py-4 font-black text-[10px] text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
          >
            CANCEL
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid || loading || fetchingLogs}
            className="flex-[2] py-3 sm:py-4 bg-[#64748b] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-slate-100 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "SENDING..." : "SEND FOR APPROVAL"}
          </button>
        </div>
      </div>
    </div>
  );
}