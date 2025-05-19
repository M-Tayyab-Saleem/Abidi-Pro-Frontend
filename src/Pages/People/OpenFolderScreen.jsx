import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";

const OpenFolderScreen = ({ folder, onclose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFiles((prevFiles) => [...prevFiles, file]);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-end mb-4">
        <button
          onClick={onclose}
          className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded text-sm text-black items-end"
        >
          <RxCross2 />
        </button>
      </div>

      <div className="flex justify-between">
        {/* Controls */}
        <div className="flex items-center space-x-4">
          <label className="text-sm text-heading">Show</label>
          <select className="text-sm px-2 py-1 text-heading bg-secondary rounded-md">
            <option className="text-gray-700">10</option>
            <option className="text-gray-700">25</option>
            <option className="text-gray-700">50</option>
          </select>
          <span className="text-sm text-heading">entries</span>
          <input
            type="text"
            placeholder="Search..."
            className="border px-3 py-1.5 rounded-md w-64 text-sm bg-secondary text-description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* File Upload Button */}
        <div>
          <label
            htmlFor="fileInput"
            className="bg-primary hover:bg-secondary hover:text-black text-white px-3 py-1 rounded-md cursor-pointer"
          >
            Upload File
          </label>
          <input
            id="fileInput"
            type="file"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>
      </div>

      {/* Uploaded Files Table */}
      {uploadedFiles.length > 0 && (
        <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-sm">
          <thead>
            <tr className="bg-gray-100 text-left text-sm text-gray-700">
              <th className="px-4 py-2 border-b">File Name</th>
              <th className="px-4 py-2 border-b">Size (KB)</th>
              <th className="px-4 py-2 border-b">Type</th>
            </tr>
          </thead>
          <tbody>
            {uploadedFiles.map((file, index) => (
              <tr key={index} className="text-sm text-gray-800">
                <td className="px-4 py-2 border-b">{file.name}</td>
                <td className="px-4 py-2 border-b">
                  {(file.size / 1024).toFixed(2)}
                </td>
                <td className="px-4 py-2 border-b">{file.type || "Unknown"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OpenFolderScreen;
