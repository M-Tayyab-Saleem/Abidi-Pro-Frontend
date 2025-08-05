import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import timesheetApi from "../../api/timesheetApi";
import timeLogApi from "../../api/timeLogApi";
import { toast } from "react-toastify";

export default function CreateTimesheetModal({ open, onClose, onTimesheetCreated }) {
  const [timesheetName, setTimesheetName] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchingLogs, setFetchingLogs] = useState(false);

  // Format date as MM-DD-YYYY
  const formatDate = (date) => {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return `${month}-${day}-${year}`;
  };

  useEffect(() => {
    if (open) {
      const today = new Date();
      const formattedDate = formatDate(today);
      setTimesheetName(`Timesheet (${formattedDate})`);
      setDescription("");
      setAttachment(null);
      setLogs([]);
      setError(null);
      
      // Fetch today's logs
      fetchTodaysLogs();
    }
  }, [open]);

  const fetchTodaysLogs = async () => {
    try {
      setFetchingLogs(true);
      const today = new Date();
      const response = await timeLogApi.getEmployeeTimeLogs(today.toISOString().split('T')[0]);
      
      // Filter logs that haven't been added to a timesheet yet
      const availableLogs = response.filter(log => !log.isAddedToTimesheet);
      setLogs(availableLogs);
      
      if (availableLogs.length === 0) {
        toast.warning("No available time logs found for today");
      }
    } catch (err) {
      console.error("Failed to fetch today's logs:", err);
      toast.error("Failed to load today's time logs");
    } finally {
      setFetchingLogs(false);
    }
  };

  const isValid =
    timesheetName.trim().length >= 3 &&
    description.trim().length >= 5 &&
    logs.length > 0;

  const handleSubmit = async () => {
  if (!isValid) return;

  setLoading(true);
  try {
    const formData = new FormData();
    formData.append('name', timesheetName);
    formData.append('description', description);
    
    if (attachment) {
      formData.append('attachments', attachment); // Single file
    }
    
    logs.forEach(log => {
      formData.append('timeLogs', log._id); // Simplified array format
    });

    await timesheetApi.createTimesheet(formData);
    toast.success("Timesheet created successfully!");
    onTimesheetCreated(); 
    onClose(); 
  } catch (error) {
    console.error("Failed to create timesheet:", error);
    const errorMsg = error.response?.data?.message || "Failed to create timesheet";
    setError(errorMsg);
    toast.error(errorMsg);
  } finally {
    setLoading(false);
  }
};
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={onClose}
        ></div>
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-lg bg-white text-black p-6 shadow-xl z-50 overflow-y-auto transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <IoClose size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-4">Create Timesheet</h2>

                {/* Today's Logs */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Today's Time Logs</h3>
          {fetchingLogs ? (
            <div className="text-center p-4">Loading today's logs...</div>
          ) : logs.length === 0 ? (
            <p className="text-gray-500 text-sm">No time logs found for today.</p>
          ) : (
            <ul className="space-y-3">
              {logs.map((log) => (
                <li
                  key={log._id}
                  className="border border-gray-200 p-4 rounded-lg bg-gray-50"
                >
                  <div>
                    <p className="text-sm">
                      <strong>Job:</strong> {log.job || log.jobTitle}
                    </p>
                    <p className="text-sm">
                      <strong>Time:</strong> {new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-sm">
                      <strong>Hours:</strong> {log.hours}
                    </p>
                    <p className="text-sm">
                      <strong>Description:</strong> {log.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Timesheet Name - Readonly */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">
            Timesheet Name
          </label>
          <input
            type="text"
            value={timesheetName}
            readOnly
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            rows="3"
            placeholder="Describe the timesheet summary..."
            required
          />
        </div>

        {/* Attachment */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">Attachment</label>
          <input
            type="file"
            onChange={(e) => setAttachment(e.target.files[0])}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid || loading || fetchingLogs}
            className={`px-4 py-2 rounded-lg ${
              isValid && !loading && !fetchingLogs
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-blue-300 cursor-not-allowed"
            } text-white`}
          >
            {loading ? "Sending..." : "Send for Approval"}
          </button>
        </div>

        
      </div>
    </>
  );
}