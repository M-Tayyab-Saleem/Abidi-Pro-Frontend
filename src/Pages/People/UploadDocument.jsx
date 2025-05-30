import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Drawer, TextField } from '@mui/material';
import { FiUpload } from 'react-icons/fi';
import { Spin, Alert } from 'antd';

import FolderGrid from './FolderGrid';
import OpenFolderScreen from './OpenFolderScreen';
import { useFolderContents, useFileUploader, useFolderCreator } from '../../Hooks/useDrive';
import { toast } from 'react-toastify';

const UploadDocument = () => {
  const [openedFolder, setOpenedFolder] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const data = useSelector((state) => state);
  const { user } = data?.auth;

  const folderId = openedFolder?.id || 'root';
  const folderPath = `users/${user.id}/${folderId}`;

  const { folders, files, loading, error, reload } = useFolderContents(folderId);
  const { create, loading: creating, error: createErr } = useFolderCreator();
  const { upload, loading: uploading, error: uploadErr } = useFileUploader();

  const toggleDrawer = (open) => () => setDrawerOpen(open);

  const handleNewFolder = async () => {
    if (!folderName.trim()) {
      toast.error("Folder name is required");
      return;
    }
    try {
      await create({ name: folderName, parentId: folderId });
      setFolderName('');
      setDrawerOpen(false);
      reload();
    } catch (err) {
      toast.error("Failed to create folder");
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await upload({ file, folderId, folderPath });
      reload();
    } catch (err) {
      toast.error("File upload failed");
    }
  };

  if (error) return <Alert message={error.message} type="error" />;

  return (
    <>
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <div className="w-full sm:w-80 md:w-96 h-full bg-white p-6 flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-gray-800">Create Folder</h2>
          <TextField
            label="Folder Name"
            variant="outlined"
            fullWidth
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            size="small"
          />
          <button
            onClick={handleNewFolder}
            disabled={creating}
            className="mt-2 bg-[#497a71] text-white text-sm py-2 rounded-md hover:bg-[#99c7be] hover:text-black"
          >
            {creating ? 'Creating…' : 'Create Folder'}
          </button>
          {createErr && <Alert message={createErr.message} type="error" />}
        </div>
      </Drawer>

      {openedFolder ? (
        <OpenFolderScreen
          folder={openedFolder}
          onClose={() => setOpenedFolder(null)}
        />
      ) : (
        <div className="min-h-screen bg-primary p-2 sm:p-4 mx-2 my-4 sm:m-6 rounded-lg shadow-md">
          <div className="flex flex-col mb-5 bg-white rounded-lg px-4 py-4 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-3 sm:mb-0">
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
              <div className="mt-3 sm:mt-0 flex items-center gap-2">
                <input type="file" onChange={handleFileChange} className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="cursor-pointer bg-[#497a71] text-white text-sm px-4 py-2 rounded-md hover:bg-[#99c7be] hover:text-black">
                  Upload File
                </label>
                <button
                  onClick={toggleDrawer(true)}
                  className="flex items-center gap-2 bg-[#497a71] text-white text-sm px-4 py-2 rounded-md hover:bg-[#99c7be] hover:text-black"
                >
                  <FiUpload /> New Folder
                </button>
              </div>
            </div>
          </div>

          {uploadErr && <Alert message={uploadErr.message} type="error" />}

          <Spin spinning={loading}>
            <div className="mb-4 overflow-x-auto">
              <FolderGrid
                folders={folders.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()))}
                onOpenFolder={setOpenedFolder}
              />
            </div>
          </Spin>
        </div>
      )}
    </>
  );
};

export default UploadDocument;
