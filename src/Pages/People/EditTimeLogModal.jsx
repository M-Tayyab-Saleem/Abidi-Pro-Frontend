import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";

const EditTimeLogModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [date, setDate] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [hours, setHours] = useState("");
  const [description, setDescription] = useState("");
  const [attachmentName, setAttachmentName] = useState("");
  const [newAttachment, setNewAttachment] = useState(null);

  useEffect(() => {
    if (initialData) {
      setDate(initialData.date);
      setJobTitle(initialData.jobTitle);
      setHours(initialData.totalHours);
      setDescription(initialData.description);
      setAttachmentName(initialData.attachmentName || "");
      setNewAttachment(null); // clear new file when modal reopens
    }
  }, [initialData]);

  const isDateValid = Boolean(date);
  const isHoursValid = Number(hours) > 0;
  const isDescriptionValid = description.trim().length >= 5;

  const isCurrentInputValid = isDateValid && isHoursValid && isDescriptionValid;

  const handleSave = () => {
    if (isCurrentInputValid) {
      onSave([
        {
          jobTitle,
          date,
          description: description.trim(),
          hours: parseFloat(hours),
          attachmentName: newAttachment
            ? newAttachment.name
            : attachmentName,
        },
      ]);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
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

        <h2 className="text-2xl font-bold mb-6 pb-2">
          Edit Time Log
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="space-y-5"
        >
          <div>
            <label className="block text-sm font-semibold mb-2">Job Title</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g., Frontend Development"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Hours</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            {!isHoursValid && hours && (
              <p className="text-xs text-red-600 mt-1">
                Hours must be greater than 0
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the work done..."
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            {!isDescriptionValid && description && (
              <p className="text-xs text-red-600 mt-1">
                Description must be at least 5 characters
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Replace Attachment
            </label>
            <input
              type="file"
              onChange={(e) => setNewAttachment(e.target.files[0])}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {attachmentName && !newAttachment && (
              <p className="text-xs text-gray-600 mt-1">
                Current File: <strong>{attachmentName}</strong>
              </p>
            )}
            {newAttachment && (
              <p className="text-xs text-green-600 mt-1">
                New File: <strong>{newAttachment.name}</strong>
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isCurrentInputValid}
              className={`px-4 py-2 rounded-lg ${
                !isCurrentInputValid
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white font-semibold`}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditTimeLogModal;
