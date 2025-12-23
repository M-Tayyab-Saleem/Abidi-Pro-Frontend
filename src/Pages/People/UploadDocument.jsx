"use client"
import { useState } from "react"
import { useSelector } from "react-redux"
import { Drawer, TextField, Menu, MenuItem, IconButton } from "@mui/material"
import { FiUpload } from "react-icons/fi"
import { Spin, Alert } from "antd"
import {
  useFolderContents,
  useFileUploader,
  useFolderCreator,
  useFileDeleter,
  useFolderDeleter,
  useFileDownloader,
} from "../../Hooks/useDrive"
import { toast } from "react-toastify"
import { IoEllipsisVertical } from "react-icons/io5"

const UploadDocument = () => {
  const [folderStack, setFolderStack] = useState([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [folderName, setFolderName] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [folderMenuAnchor, setFolderMenuAnchor] = useState(null)
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null)
  const [selectedFolderId, setSelectedFolderId] = useState(null)
  const [selectedFileId, setSelectedFileId] = useState(null)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [currentFile, setCurrentFile] = useState(null)
  const [accessSettings, setAccessSettings] = useState({
    isPublic: false,
    sharedWithRoles: [],
    userEmails: []
  })

  const handleShareFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    setCurrentFile(file)
    setAccessSettings({
      isPublic: false,
      sharedWithRoles: [],
      userEmails: []
    })
    setShareModalOpen(true)
  }

  const handleOpenAccessModal = () => {
    setShareModalOpen(true)
  }

  const data = useSelector((state) => state)
  const { user } = data?.auth || {}
  
  const currentFolder = folderStack.length > 0 
    ? folderStack[folderStack.length - 1] 
    : { id: "root", name: "Root", _id: "root" }
  
  const folderId = currentFolder._id === "root" ? 'root' : currentFolder._id

  const { 
    folders = [], 
    files = [], 
    loading, 
    error, 
    reload 
  } = useFolderContents(folderId)
  
  const { create, loading: creating, error: createErr } = useFolderCreator()
  const { upload, loading: uploading, error: uploadErr, updateFileAccess } = useFileUploader()
  const { softDelete: deleteFile, loading: fileDeleteLoading } = useFileDeleter()
  const { softDelete: deleteFolder, loading: folderDeleteLoading } = useFolderDeleter()
  const { download, loading: downloadLoading } = useFileDownloader()
  
  const toggleDrawer = (open) => () => setDrawerOpen(open)

  const handleNewFolder = async () => {
    if (!folderName.trim()) {
      toast.error("Folder name is required")
      return
    }
    try {
      await create({ 
        name: folderName, 
        parentId: folderId,
        ownerId: user?._id 
      })
      setFolderName("")
      setDrawerOpen(false)
      reload()
      toast.success("Folder created successfully")
    } catch (err) {
      toast.error("Failed to create folder")
      console.error(err)
    }
  }

  const handleFileDownload = async (fileId) => {
    try {
      await download(fileId)
    } catch (err) {
      toast.error("Download failed")
      console.error(err)
    }
  }

  const handleFileChange = async (file) => {
    if (!file) return
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folderId', folderId) 
      
      await upload(formData)
      toast.success('File uploaded successfully')
      reload()
    } catch (err) {
      toast.error("File upload failed")
      console.error(err)
    }
  }

const handleSaveAccessSettings = async () => {
  try {
    if (currentFile) {
      const formData = new FormData();
      formData.append('file', currentFile);
      formData.append('folderId', folderId); 
      formData.append('isPublic', accessSettings.isPublic);
      formData.append('sharedWithRoles', JSON.stringify(accessSettings.sharedWithRoles));
      formData.append('userEmails', JSON.stringify(accessSettings.userEmails));

      await upload(formData);
      toast.success('File uploaded with access settings!');
    } else if (selectedFileId) {
      await updateFileAccess(selectedFileId, accessSettings);
      toast.success('Access updated successfully');
    }
    
    setShareModalOpen(false);
    setCurrentFile(null); // Reset current file
    reload();
  } catch (err) {
    toast.error('Failed to process file');
    console.error(err);
  }
};

  const handleOpenFolder = (folder) => {
    setFolderStack([...folderStack, folder])
  }

  const handleDeleteFile = async (fileId) => {
    console.log("Attempting to delete file:", fileId)
    if (!window.confirm("Are you sure you want to delete this file?")) return

    try {
      await deleteFile(fileId)
      toast.success("File deleted")
      reload()
      handleCloseFileMenu()
    } catch (error) {
      console.error("Delete file error:", error)
      toast.error("Failed to delete file")
    }
  }

  const handleDeleteFolder = async (folderId) => {
    console.log("Attempting to delete folder:", folderId)
    if (!window.confirm("Are you sure you want to delete this folder?")) return

    try {
      await deleteFolder(folderId)
      toast.success("Folder deleted")
      reload()
      handleCloseFolderMenu()
    } catch (error) {
      console.error("Delete folder error:", error)
      toast.error("Failed to delete folder")
    }
  }

  const handleGoBack = () => {
    if (folderStack.length === 0) return
    setFolderStack(folderStack.slice(0, -1))
  }

  const handleFolderMenuClick = (event, folderId) => {
    event.stopPropagation()
    setFolderMenuAnchor(event.currentTarget)
    setSelectedFolderId(folderId)
  }

  const handleCloseFolderMenu = () => {
    setFolderMenuAnchor(null)
    setSelectedFolderId(null)
  }

  const handleFileMenuClick = (event, fileId) => {
    event.stopPropagation()
    setFileMenuAnchor(event.currentTarget)
    setSelectedFileId(fileId)
  }

  const handleCloseFileMenu = () => {
    setFileMenuAnchor(null)
    setSelectedFileId(null)
  }

  if (error) return <Alert message={error.message} type="error" />

  return (
    <>
      {shareModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Share {currentFile?.name || files.find(f => f._id === selectedFileId)?.name}</h3>
            
            <div className="mb-4">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={accessSettings.isPublic}
                  onChange={(e) => setAccessSettings({
                    ...accessSettings,
                    isPublic: e.target.checked
                  })}
                  className="mr-2"
                />
                Make public (anyone with link can view)
              </label>
            </div>

            <div className="mb-4">
              <label className="block mb-2">Share with roles:</label>
              {['manager', 'employee', 'hr'].map(role => (
                <label key={role} className="flex items-center mr-4">
                  <input
                    type="checkbox"
                    checked={accessSettings.sharedWithRoles.includes(role)}
                    onChange={(e) => {
                      const newRoles = e.target.checked
                        ? [...accessSettings.sharedWithRoles, role]
                        : accessSettings.sharedWithRoles.filter(r => r !== role);
                      setAccessSettings({
                        ...accessSettings,
                        sharedWithRoles: newRoles
                      });
                    }}
                    className="mr-2"
                  />
                  {role}
                </label>
              ))}
            </div>

            <div className="mb-4">
              <label className="block mb-2">Share with specific people:</label>
              <input
                type="email"
                placeholder="Enter email"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value) {
                    setAccessSettings({
                      ...accessSettings,
                      userEmails: [...accessSettings.userEmails, e.target.value]
                    });
                    e.target.value = '';
                  }
                }}
                className="border p-2 w-full"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {accessSettings.userEmails.map(email => (
                  <span key={email} className="bg-gray-100 px-2 py-1 rounded flex items-center">
                    {email}
                    <button
                      onClick={() => setAccessSettings({
                        ...accessSettings,
                        userEmails: accessSettings.userEmails.filter(e => e !== email)
                      })}
                      className="ml-2 text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShareModalOpen(false);
                  setCurrentFile(null);
                }}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAccessSettings}
                className="px-4 py-2 bg-blue-500 text-white rounded"
                disabled={uploading}
              >
                {uploading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
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
            {creating ? "Creating…" : "Create Folder"}
          </button>
          {createErr && <Alert message={createErr.message} type="error" />}
        </div>
      </Drawer>

      <div className="min-h-screen bg-primary p-2 sm:p-4 mx-2 my-4 sm:m-6 rounded-lg shadow-md">
        {/* Header with breadcrumb */}
        <div className="flex flex-col mb-5 bg-white rounded-lg px-4 py-4 sm:px-8">
          {/* Breadcrumb */}
          <div className="mb-4 text-sm text-gray-600">
            <span 
              className="cursor-pointer hover:text-blue-600" 
              onClick={() => setFolderStack([])}
            >
              Root
            </span>
            {folderStack.map((folder, index) => (
              <span key={folder._id}>
                {' > '}
                <span 
                  className="cursor-pointer hover:text-blue-600"
                  onClick={() => setFolderStack(folderStack.slice(0, index + 1))}
                >
                  {folder.name}
                </span>
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
            <div className="flex flex-wrap items-center gap-3 mb-3 sm:mb-0">
              <div className="flex items-center space-x-2">
                <label className="text-sm">Show</label>
                <select className="text-sm px-2 py-1 bg-secondary rounded-md">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
                <span className="text-sm">entries</span>
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="border-0 px-3 py-1.5 rounded-md shadow-md w-64 text-sm bg-secondary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="file" 
                onChange={(e) => handleFileChange(e.target.files[0])} 
                className="hidden" 
                id="file-upload" 
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer bg-[#497a71] text-white text-sm px-4 py-2 rounded-md hover:bg-[#99c7be] hover:text-black"
              >
                Upload Files
              </label>
              <input 
                type="file" 
                onChange={handleShareFile} 
                className="hidden" 
                id="file-upload-with-share" 
              />
              <label
                htmlFor="file-upload-with-share"
                className="cursor-pointer bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Upload & Share
              </label>
              <button
                onClick={toggleDrawer(true)}
                className="flex items-center gap-2 bg-[#497a71] text-white text-sm px-4 py-2 rounded-md hover:bg-[#99c7be] hover:text-black"
              >
                <FiUpload /> New Folder
              </button>
              {folderStack.length > 0 && (
                <button 
                  onClick={handleGoBack} 
                  className="bg-gray-300 text-sm px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Go Back
                </button>
              )}
            </div>
          </div>
        </div>

        {uploadErr && <Alert message={uploadErr.message} type="error" />}

        <Spin spinning={loading || uploading || creating || fileDeleteLoading || folderDeleteLoading || downloadLoading}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Show empty state if no folders and no files */}
            {folders.length === 0 && files.length === 0 && !loading && (
              <div className="col-span-full text-center py-12 bg-white rounded-lg">
                <div className="text-gray-500 text-lg">📁</div>
                <p className="text-gray-500 mt-2">
                  {currentFolder.name === 'Root' ? 'No folders or files yet' : 'This folder is empty'}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Upload files or create folders to get started
                </p>
              </div>
            )}

            {/* Folders */}
            {folders.map((folder) => (
              <div
                key={folder._id}
                onClick={(e) => {
                  e.stopPropagation()
                  handleOpenFolder(folder)
                }}
                className="flex justify-between items-center bg-white rounded p-4 shadow cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-2">📁</span>
                  <span className="truncate">{folder.name}</span>
                </div>
                <IconButton size="small" onClick={(e) => handleFolderMenuClick(e, folder._id)} className="p-1">
                  <IoEllipsisVertical />
                </IconButton>
              </div>
            ))}

            {/* Files */}
            {files.map((file) => (
              <div key={file._id} className="flex justify-between items-center bg-white rounded p-4 shadow hover:shadow-md transition-shadow">
                <div className="flex items-center min-w-0">
                  <span className="text-2xl mr-2">📄</span>
                  <span className="truncate" title={file.name}>{file.name}</span>
                </div>
                <IconButton size="small" onClick={(e) => handleFileMenuClick(e, file._id)} className="p-1 flex-shrink-0">
                  <IoEllipsisVertical />
                </IconButton>
              </div>
            ))}
          </div>
        </Spin>

        {/* Folder Menu */}
        <Menu
          anchorEl={folderMenuAnchor}
          open={Boolean(folderMenuAnchor)}
          onClose={handleCloseFolderMenu}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          {/* <MenuItem
            onClick={() => {
              console.log("Update folder:", selectedFolderId)
              handleCloseFolderMenu()
              // TODO: Trigger update modal or logic here
            }}
          >
            Rename
          </MenuItem> */}
          <MenuItem
            onClick={() => {
              console.log("Delete folder clicked:", selectedFolderId)
              handleDeleteFolder(selectedFolderId)
            }}
            sx={{ color: "red" }}
          >
            Delete
          </MenuItem>
        </Menu>

        {/* File Menu */}
        <Menu
          anchorEl={fileMenuAnchor}
          open={Boolean(fileMenuAnchor)}
          onClose={handleCloseFileMenu}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
           <MenuItem onClick={() => {
              setSelectedFileId(selectedFileId);
              handleCloseFileMenu();
              handleOpenAccessModal();
            }}>
            Share
            </MenuItem>
           <MenuItem
            onClick={() => {
              console.log("Download file:", selectedFileId)
              handleFileDownload(selectedFileId)
              handleCloseFileMenu()
            }}
          >
            Download
          </MenuItem>
          <MenuItem
            onClick={() => {
              console.log("Update file:", selectedFileId)
              handleCloseFileMenu()
              // TODO: Trigger update modal or logic here
            }}
          >
            Rename
          </MenuItem>
          <MenuItem
            onClick={() => {
              console.log("Delete file clicked:", selectedFileId)
              handleDeleteFile(selectedFileId)
            }}
            sx={{ color: "red" }}
          >
            Delete
          </MenuItem>
        </Menu>
      </div>
    </>
  )
}

export default UploadDocument