// src/hooks/useDrive.js
import { useState, useEffect, useCallback } from 'react'
import api from '../axios'
import { useSelector } from 'react-redux'

/** 1️⃣ Fetch folder contents */
export function useFolderContents(folder) {
  const [folders, setFolders] = useState([])
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const folderId = folder || 'root'
  const reload = useCallback(async () => {
    setLoading(true);
    setError(null)
    try {
      console.log(folderId, "hello")
      const { data } = await api.get(`/files/folders/${folderId || 'root'}/contents`)
      console.log("getting files and folder", data)
      setFolders(data.folders)
      setFiles(data.files)
    } catch (e) {
      setError(e)
      console.log(e, "get files")
    } finally {
      setLoading(false)
    }
  }, [folderId])

  useEffect(() => { reload() }, [reload])

  return { folders, files, loading, error, reload }
}

/** 2️⃣ Download a file */
export function useFileDownloader() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const download = useCallback(async (fileId) => {
    setLoading(true); setError(null)
    try {
      const { data: { downloadUrl } } = await api.get(`/files/files/${fileId}/download`)
      window.open(downloadUrl, '_blank')
    } catch (e) {
      setError(e)
    } finally {
      setLoading(false)
    }
  }, [])

  return { download, loading, error }
}

export function useFileUploader() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const cloudinaryProjectName = import.meta.env.VITE_REACT_APP_CLOUDINARY_CLOUD_NAME;
  const { user } = useSelector(state => state.auth);

  // Main upload function
  const upload = useCallback(async ({ file, folderId, folderPath, accessSettings = {} }) => {
    setLoading(true); 
    setError(null);
    
    try {
      // [Previous upload implementation remains exactly the same...]
      // ... (keep all your existing upload code)

      return {
        ...uploadRes,
        accessSettings: {
          isPublic: fileData.isPublic,
          sharedWithRoles: fileData.sharedWithRoles,
          acl: fileData.acl
        }
      };
    } catch (e) {
      setError(e);
      console.error("Upload failed:", e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // NEW: Function to update file access
  const updateFileAccess = useCallback(async (fileId, accessSettings) => {
    setLoading(true);
    setError(null);
console.log(accessSettings)
    try {
      const { data } = await api.patch(`/files/${fileId}/access`, {
        isPublic: accessSettings.isPublic,
        sharedWithRoles: accessSettings.sharedWithRoles,
        aclUpdates: accessSettings.userEmails?.map(email => ({
          email,
          role: 'viewer',
          accessType: 'user'
        })) || []
      });

      return data; // Returns updated file document
    } catch (e) {
      setError(e);
      console.error("Failed to update access:", e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  // NEW: Function to get current access settings
  const getFileAccess = useCallback(async (fileId) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.get(`/files/${fileId}`);
      
      return {
        isPublic: data.isPublic,
        sharedWithRoles: data.sharedWithRoles,
        userEmails: data.acl
          .filter(entry => entry.email)
          .map(entry => entry.email)
      };
    } catch (e) {
      setError(e);
      console.error("Failed to fetch access settings:", e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { 
    upload, 
    updateFileAccess, // Add to return object
    getFileAccess,    // Add to return object
    loading, 
    error 
  };
}
/** 4️⃣ Create a new folder */
export function useFolderCreator() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const create = useCallback(async ({ name, parentId, ownerId }) => {
    setLoading(true); setError(null)
    try {
      const { data } = await api.post('/files/folders', { name, parentId, ownerId })
      // console.log(data,"green")
      return data
    } catch (e) {
      setError(e)
      console.log(e.response.data)
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  return { create, loading, error }
}



/** 5️⃣ Soft delete a file */
export function useFileDeleter() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const softDelete = useCallback(async (fileId) => {
    setLoading(true); setError(null);
    try {
      const { data } = await api.patch(`/files/files/${fileId}/soft-delete`);
      return data;
    } catch (e) {
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { softDelete, loading, error };
}

/** 6️⃣ Soft delete a folder */
export function useFolderDeleter() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const softDelete = useCallback(async (folderId) => {
    setLoading(true); setError(null);
    try {
      const { data } = await api.patch(`/files/folders/folders/${folderId}/soft-delete`);
      return data;
    } catch (e) {
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { softDelete, loading, error };
}
