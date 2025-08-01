import React from "react";
import { IoClose } from "react-icons/io5";
import { FaDownload } from 'react-icons/fa';

const ViewTimeLogModal = ({ log, onClose }) => {
  if (!log) return null;

  // This assumes you store the file somewhere accessible by URL:
  // If it’s saved in storage (e.g., /uploads/myfile.pdf), you can build the URL.
  const getDownloadLink = (fileName) => {
    // Example: adjust according to your server/storage setup!
    return `/uploads/${fileName}`;
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>

      <div className="fixed top-0 right-0 h-full w-full max-w-lg bg-white text-black p-6 shadow-xl z-50 overflow-y-auto">
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <IoClose size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6 pb-2">
          View Time Log
        </h2>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-1">
              Job Title
            </label>
            <p className="px-4 py-2 border border-gray-200 rounded-lg bg-gray-50">
              {log.jobTitle || "-"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Date
            </label>
            <p className="px-4 py-2 border border-gray-200 rounded-lg bg-gray-50">
              {log.date || "-"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Description
            </label>
            <p className="px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 whitespace-pre-line">
              {log.description || "-"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Hours
            </label>
            <p className="px-4 py-2 border border-gray-200 rounded-lg bg-gray-50">
              {log.totalHours || "-"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Attachment
            </label>
            {log.attachmentName ? (
              <div className="px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-between">
                <span>{log.attachmentName}</span>
                <a
                  href={getDownloadLink(log.attachmentName)}
                  download
                  className="border-l ml-4 text-sm text-green py-1 px-2 rounded"
                >
                    <FaDownload size={16} />
                </a>
              </div>
            ) : (
              <p className="px-4 py-2 border border-gray-200 rounded-lg bg-gray-50">
                -
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Status
            </label>
            <p className="px-4 py-2 border border-gray-200 rounded-lg bg-gray-50">
              {log.status || "-"}
            </p>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewTimeLogModal;
