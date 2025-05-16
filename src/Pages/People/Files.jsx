

import React, { useState } from "react";
import { FaRegFolder } from "react-icons/fa6";
import { IoListOutline, IoFilterSharp } from "react-icons/io5";
import FileTabs from "./FileTabs";
import FileTable from "./FileTable";
import FolderGrid from "./FolderGrid";
import { FiUpload } from "react-icons/fi";


import Button from "@mui/material/Button";
import UploadIcon from "@mui/icons-material/Upload";
import UploadModal from "./UploadModal";

const Files = () => {
  const [activeTab, setActiveTab] = useState("sharedWithMe");
  const [viewMode, setViewMode] = useState("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [folders, setFolders] = useState([]);

  const handleAddFolder = (newFolder) => {
  setFolders((prev) => [...prev, newFolder]);
};

  return (
    <div className="min-h-screen bg-[#dce3f0] p-4 m-6 rounded-lg shadow-md ">
      {/* FILE TABS */}
      <FileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Search and View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center mb-5 space-y-2 sm:space-y-0 sm:space-x-4 justify-between">
        <div className="flex items-center space-x-4">
          <label className="text-sm text-heading">Show</label>
          <select className="text-sm px-2 py-1 text-heading bg-secondary rounded-md">
            <option className="text-gray-700">10</option>
            <option className="text-gray-700">25</option>
            <option className="text-gray-700">50</option>
          </select>
          <span className="text-sm text-heading">entries</span>
          {/* <label className="text-sm text-heading">Search</label> */}
          <input
            type="text"
            placeholder="Search..."
            className="border-0 px-3 py-1.5 rounded-md w-full sm:w-64 text-sm bg-secondary text-description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode("table")}
            className={`p-2 rounded ${
              viewMode === "table" ? "bg-primary text-black" : "bg-gray-200"
            }`}
            title="Table view"
          >
            <IoListOutline />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded ${
              viewMode === "grid" ? "bg-primary text-black" : "bg-gray-200"
            }`}
            title="Grid view"
          >
            <FaRegFolder />
          </button>
          <button className="p-2 rounded bg-gray-200" title="Filter">
            <IoFilterSharp />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="mb-4">
        {viewMode === "grid" ? (
          <>
            <div className="flex justify-end">
              <Button
                variant="contained"
                startIcon={<UploadIcon />}
                onClick={() => setOpen(true)}
              >
                Upload Document
              </Button>
            </div>
               <UploadModal open={open} onClose={() => setOpen(false)} setFolders={setFolders} folders={folders} onCreate={handleAddFolder} />
            <FolderGrid folders={folders} searchTerm={searchTerm} />
          </>
        ) : (
          <FileTable searchTerm={searchTerm} />
        )}
      </div>
    </div>
  );
};

export default Files;
