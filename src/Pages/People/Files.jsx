import React, { useState } from 'react';
import { FaRegFolder } from 'react-icons/fa6';
import { IoListOutline, IoFilterSharp } from 'react-icons/io5';
import { Spin, Alert } from 'antd';
import FileTable from './FileTable';
import FolderGrid from './FolderGrid';
import OpenFolderScreen from './OpenFolderScreen';
import Role from './sharedWithRole';
import UploadDocument from './UploadDocument';
import { useFolderContents, useFileDownloader } from '../../Hooks/useDrive';
import { useSelector } from 'react-redux';

export default function Files() {
  const [viewMode, setViewMode] = useState('table');
  const [searchTerm, setSearchTerm] = useState('Project');
  const [openedFolder, setOpenedFolder] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const data = useSelector((state) => state);
  const { user } = data?.auth;
  const folderId = openedFolder?.id || 'root';
  const folderPath = `users/${user.id}/${folderId}`;

  const { folders, files, loading, error, reload } = useFolderContents(folderId);
  const { download, loading: dlLoading } = useFileDownloader();

  const safeFolders = Array.isArray(folders) ? folders : [];
  const safeFiles = Array.isArray(files) ? files : [];

  const tabs = [
    { title: "My Files" },
    { title: "Shared Files" },
    // { title: "Upload Documents" }
  ];

  if (error) return <Alert message={error.message} type="error" />;

  if (openedFolder) {
    return (
      <OpenFolderScreen
        folder={openedFolder}
        onClose={() => setOpenedFolder(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-primary p-2 sm:p-4 mx-2 my-4 sm:m-6 rounded-lg shadow-md">
      {/* Tab Bar */}
      <div className="inline-flex flex-row flex-wrap items-center justify-center bg-white p-1 rounded-lg shadow-sm border border-gray-200 mb-4">
        {tabs.map((item, index) => (
          <div key={item.title} className="flex items-center">
            <button
              className={`px-4 py-2 text-sm font-medium transition-colors duration-200
                ${activeTab === index
                  ? "text-primary bg-primary/10 rounded-md"
                  : "text-heading hover:text-primary hover:bg-gray-100 rounded-md"
                }`}
              onClick={() => setActiveTab(index)}
            >
              {item.title}
            </button>
            {index !== tabs.length - 1 && (
              <span className="w-px h-4 bg-gray-300 mx-1"></span>
            )}
          </div>
        ))}
      </div>

      {/* Search and View Controls - Only show for first two tabs */}
      {(activeTab === 0) && (
        <div className="flex flex-col space-y-4 mb-5 bg-white rounded-lg px-4 py-4 sm:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between w-full">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-3 lg:mb-0">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <label className="text-sm text-heading whitespace-nowrap">Show</label>
                <select className="text-sm px-2 py-1 text-heading bg-secondary rounded-md shadow-md">
                  <option className="text-gray-700">10</option>
                  <option className="text-gray-700">25</option>
                  <option className="text-gray-700">50</option>
                </select>
                <span className="text-sm text-heading">entries</span>
              </div>

              <div className="w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search..."
                  className="border-0 px-3 py-1.5 rounded-md shadow-md w-full sm:w-64 text-sm bg-secondary text-description"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 0 && (
        <Spin spinning={loading}>
          {viewMode === 'grid' ? (
            <FolderGrid folders={safeFolders} onOpenFolder={setOpenedFolder} />
          ) : (
            <FileTable
              files={safeFiles.filter((f) => true)}
              onDownload={download}
              loading={dlLoading}
            />
          )}
        </Spin>
      )}

      {activeTab === 1 && <Role />}
      {/* {activeTab === 2 && <UploadDocument />} */}
    </div>
  );
}