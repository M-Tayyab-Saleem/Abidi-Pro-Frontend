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

export function useMyFiles() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMyFiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/files/files/getMyFiles');
      console.log("Fetched my files:", data);
      setFiles(data.files);
    } catch (err) {
      console.error("Error fetching my files:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyFiles();
  }, [fetchMyFiles]);

  return { files, loading, error, reload: fetchMyFiles };
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
  // const { user } = useSelector(state => state.auth);
const upload = useCallback(async ({ file, folderId, accessSettings }) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Prepare FormData for backend (which sends to Cloudinary)
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folderId', folderId); // Optional, if backend uses it
      formData.append('isPublic', accessSettings?.isPublic || false);
      formData.append('sharedWithEmails', JSON.stringify(accessSettings?.userEmails || []));

      // 2. Upload to backend → which handles multer + cloudinary upload
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData
      });

      const   result = await response.json();

      if (!response.ok) throw new Error(result.error || 'Upload failed');

      // 3. (Optional) Save file record to DB if backend didn’t already
      const fileData = {
        name: result.original_filename,
        folderId,
        cloudinaryId: result.public_id,
        url: result.secure_url,
        size: result.bytes,
        mimeType: `${result.resource_type}/${result.format}`,
        ...(accessSettings && {
          isPublic: accessSettings.isPublic,
          sharedWithRoles: accessSettings.sharedWithRoles,
          sharedWithEmails: accessSettings.userEmails
        })
      };

      const { data } = await api.post('/files/files/upload', fileData);

      return data;

    } catch (e) {
      setError(e);
      console.error('Upload error:', e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);


  // NEW: Function to update file access
 const updateFileAccess = useCallback(async (fileId, accessSettings) => {
  setLoading(true);
  setError(null);

  try {
    console.log(fileId, "file id not null");

    const { data } = await api.patch(`/files/files/${fileId}/access`, {
      isPublic: accessSettings.isPublic,
      aclUpdates: accessSettings.userEmails?.map(email => ({
        email,
        role: 'viewer',       // or 'editor', if you plan to support editing
        accessType: 'user'    // You might expand this in the future for 'group' or 'link'
      })) || []
    });

    return data; // Updated file doc from server
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
