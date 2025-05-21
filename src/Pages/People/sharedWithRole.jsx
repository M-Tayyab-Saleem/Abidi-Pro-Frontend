import React, { useState } from "react";
import { FaRegFolder } from "react-icons/fa6";
import { IoListOutline, IoFilterSharp } from "react-icons/io5";

import FileTable from "./FileTable";
import FolderGrid from "./FolderGrid";

import OpenFolderScreen from "./OpenFolderScreen";

const Role = () => {
  const [viewMode, setViewMode] = useState("table");
  const [searchTerm, setSearchTerm] = useState("");

  const [folders, setFolders] = useState([]);
  const [openedFolder, setOpenedFolder] = useState(null);

  const handleAddFolder = (newFolder) => {
    setFolders((prev) => [...prev, newFolder]);
  };

  return (
    <div className="min-h-screen bg-primary p-4 m-6 rounded-lg shadow-md ">
      {/* If a folder is opened, just show OpenFolderScreen */}
      {openedFolder ? (
        <OpenFolderScreen
          folder={openedFolder}
          onClose={() => setOpenedFolder(null)}
        />
      ) : (
        <>
          {/* Search and View Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center mb-5 space-y-2 sm:space-y-0 sm:space-x-4 justify-between bg-white rounded-lg px-8 py-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm text-heading">Show</label>
              <select className="text-sm px-2 py-1 text-heading bg-secondary rounded-md shadow-md">
                <option className="text-gray-700">10</option>
                <option className="text-gray-700">25</option>
                <option className="text-gray-700">50</option>
              </select>
              <span className="text-sm text-heading">entries</span>
              <input
                type="text"
                placeholder="Search..."
                className="border-0 px-3 py-1.5 rounded-md shadow-md w-full sm:w-64 text-sm bg-secondary text-description"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode("table")}
                className={` p-2 rounded ${
                  viewMode === "table"
                    ? " bg-[#99c7be] text-white"
                    : "bg-primary text-white"
                }`}
                title="Table view"
              >
                <IoListOutline />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${
                  viewMode === "grid"
                    ? " bg-[#99c7be] text-white"
                    : " bg-primary text-white"
                }`}
                title="Grid view"
              >
                <FaRegFolder />
              </button>
              <button
                className="p-2 rounded bg-primary text-white"
                title="Filter"
              >
                <IoFilterSharp />
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="mb-4">
            {viewMode === "grid" ? (
              <>
                <FolderGrid
                  folders={folders}
                  searchTerm={searchTerm}
                  onOpenFolder={setOpenedFolder}
                />
              </>
            ) : (
              <FileTable searchTerm={searchTerm} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Role;
