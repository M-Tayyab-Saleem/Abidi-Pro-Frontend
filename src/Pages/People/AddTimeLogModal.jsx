import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import timeLogApi from "../../api/timeLogApi";
import { toast } from "react-toastify";

const AddTimeLogModal = ({ isOpen, onClose, onTimeLogAdded }) => {
  const [jobTitle, setJobTitle] = useState("");
  const [customJobTitle, setCustomJobTitle] = useState("");
  const [date, setDate] = useState("");
  const [hours, setHours] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const jobOptions = [
    "Frontend Development",
    "Backend Development",
    "Design",
    "Testing",
    "Other",
  ];

  const finalJobTitle = jobTitle === "Other" ? customJobTitle.trim() : jobTitle;

  const isJobTitleValid = finalJobTitle.length >= 3;
  const isDateValid = Boolean(date);
  const isHoursValid = Number(hours) > 0;
  const isDescriptionValid = description.trim().length >= 5;

  const isCurrentInputValid =
    isJobTitleValid && isDateValid && isHoursValid && isDescriptionValid;

  const handleAddAnother = () => {
    if (isCurrentInputValid) {
      const newLog = {
        jobTitle: finalJobTitle,
        date,
        hours: parseFloat(hours),
        description: description.trim(),
        attachmentName: attachment ? attachment.name : null,
      };
      setLogs([...logs, newLog]);
      setJobTitle("");
      setCustomJobTitle("");
      setDate("");
      setHours("");
      setDescription("");
      setAttachment(null);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const payload =
        logs.length > 0
          ? logs.map((log) => ({
              job: log.jobTitle,
              date: log.date,
              hours: log.hours,
              description: log.description,
              attachments: log.attachment ? [log.attachment] : [],
            }))
          : [
              {
                job: finalJobTitle,
                date,
                hours: parseFloat(hours),
                description: description.trim(),
                attachments: attachment ? [attachment] : [],
              },
            ];

      // Create each time log
      for (const log of payload) {
        const formData = new FormData();
        formData.append("job", log.job);
        formData.append("date", log.date);
        formData.append("hours", log.hours);
        formData.append("description", log.description);
        if (log.attachments && log.attachments.length > 0) {
          formData.append("attachments", log.attachments[0]);
        }

        await timeLogApi.createTimeLog(formData);
      }

      // Clear form and close modal
      setLogs([]);
      setJobTitle("");
      setCustomJobTitle("");
      setDate("");
      setHours("");
      setDescription("");
      setAttachment(null);
      toast.success("Time log(s) added successfully!");
      onTimeLogAdded(); // This should trigger a refetch in parent
      onClose();
    } catch (error) {
      console.error("Failed to save time log:", error);
      toast.error(error.response?.data?.message || "Failed to save time log");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={onClose}
        ></div>
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-lg bg-white text-black p-6 shadow-xl z-50 overflow-y-auto transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <IoClose size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6 pb-2">Add Time Log</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddAnother();
          }}
          className="space-y-5"
        >
          {/* Job Title */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Job Title
            </label>
            <select
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black"
              required
            >
              <option value="">Select Job Title</option>
              {jobOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {jobTitle === "Other" && (
              <input
                type="text"
                placeholder="Enter custom job title"
                value={customJobTitle}
                onChange={(e) => setCustomJobTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-2 text-black"
                required
              />
            )}
            {!isJobTitleValid && jobTitle && (
              <p className="text-xs text-red-600 mt-1">
                Job Title must be at least 3 characters
              </p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black"
              required
            />
          </div>

          {/* Hours */}
          <div>
            <label className="block text-sm font-semibold mb-1">Hours</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black"
              required
            />
            {!isHoursValid && hours && (
              <p className="text-xs text-red-600 mt-1">
                Hours must be greater than 0
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black"
              required
            />
            {!isDescriptionValid && description && (
              <p className="text-xs text-red-600 mt-1">
                Description must be at least 5 characters
              </p>
            )}
          </div>

          {/* Attachment */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Attachment
            </label>
            <input
              type="file"
              onChange={(e) => setAttachment(e.target.files[0])}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black"
            />
          </div>

          {/* Add Another */}
          <div className="flex justify-start gap-2 pt-4">
            <button
              type="button"
              onClick={handleAddAnother}
              disabled={!isCurrentInputValid}
              className={`px-4 py-2 rounded-lg ${
                isCurrentInputValid
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-green-300 cursor-not-allowed"
              } text-white`}
            >
              Add & Preview
            </button>
          </div>
        </form>

        {/* Preview */}
        {logs.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-3 border-b pb-1">Preview</h3>
            <ul className="space-y-3">
              {logs.map((log, idx) => (
                <li
                  key={idx}
                  className="border border-gray-200 p-4 rounded-lg bg-gray-50"
                >
                  <p className="text-sm">
                    <strong>Job Title:</strong> {log.jobTitle}
                  </p>
                  <p className="text-sm">
                    <strong>Date:</strong> {log.date}
                  </p>
                  <p className="text-sm">
                    <strong>Hours:</strong> {log.hours}
                  </p>
                  <p className="text-sm">
                    <strong>Description:</strong> {log.description}
                  </p>
                  {log.attachmentName && (
                    <p className="text-sm">
                      <strong>Attachment:</strong> {log.attachmentName}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex gap-2 justify-end pt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={(!isCurrentInputValid && logs.length === 0) || isLoading}
            className={`px-4 py-2 rounded-lg ${
              (!isCurrentInputValid && logs.length === 0) || isLoading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
          >
            {isLoading
              ? "Saving..."
              : logs.length > 0
              ? "Save All Logs"
              : "Save Log"}
          </button>
        </div>
      </div>
    </>
  );
};

export default AddTimeLogModal;
