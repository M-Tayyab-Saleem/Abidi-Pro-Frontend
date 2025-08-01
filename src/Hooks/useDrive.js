// src/hooks/useDrive.js
import { useState, useEffect, useCallback } from 'react'
import api from '../axios'

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

/** 3️⃣ Upload a file */
export function useFileUploader() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const cloudinaryProjectName = import.meta.env.VITE_REACT_APP_CLOUDINARY_CLOUD_NAME


  const upload = useCallback(async ({ file, folderId, folderPath }) => {
    // console.log(folderId)
    console.log(folderId, folderPath + "uploading files")
    setLoading(true); setError(null)
    try {
      // Get signature
      const { data: signData } = await api.post('/files/cloudinary/signUpload', {
        folderPath,
        publicIdBase: file.name.replace(/\.[^/.]+$/, '')
      })
      // {
      // apiKey: '484193954375492',
      // signature: 'b3f93760bf0c284458cd46b4f4d107fbbddb514f',
      // timestamp: 1748884776,
      // folder: 'users/6835a0afc49069d808792872/root', its the complete folder path in cloudinary
      // public_id: 'download-1748884776' its the name of file concat with timestamp 
      // }
      // Direct upload to Cloudinary
      const formData = new FormData()
      formData.append('file', file)
      formData.append('api_key', signData.apiKey)
      formData.append('timestamp', signData.timestamp)
      formData.append('signature', signData.signature)
      formData.append('folder', signData.folder)
      formData.append('public_id', signData.public_id)

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryProjectName}/auto/upload`,
        { method: 'POST', body: formData }
      ).then((res) => res.json())
      // Register in our DB
      // upload res is returning this 
      // {
      // api_key:"484193954375492"
      // asset_folder:"users/6835a0afc49069d808792872/root"
      // asset_id:"c26dcfe99ed566111443d3f19c01e276"
      // bytes:19783
      // created_at:"2025-06-02T17:19:41Z"
      // display_name:"download-1748884776"
      // etag:"e2260ccc3879b0fe6b37d9b364c701af"
      // format:"jpg"
      // height:184
      // original_filename:"download"
      // placeholder:false
      // public_id:"users/6835a0afc49069d808792872/root/download-1748884776"
      // resource_type:"image"
      // secure_url:"https://res.cloudinary.com/dynr5qyct/image/upload/v1748884781/users/6835a0afc49069d808792872/root/download-1748884776.jpg"
      // signature:"d227b5c7b6bf07176814d50cc1e8050235a66763"
      // }
      const {
        secure_url,
        bytes,
        resource_type,
        format,
        public_id,
        original_filename,
        // created_at
      } = uploadRes;
      console.log(uploadRes)
      console.log({
        name: original_filename,                  // or your own custom name
        folderId,                                         // from context
        cloudinaryId: public_id,                          // unique identifier in Cloudinary
        url: secure_url,                         // public file URL
        size: bytes,                              // file size in bytes
        mimeType: `${resource_type}/${format}`,       // e.g., "image/jpg"
        // uploadedAt:   created_at                          // optional extra field
      }, "kharboz")
      // console.log(uploadRes,"chutiya")
      await api.post('/files/files', {
        name: original_filename,                  // or your own custom name
        folderId,                                         // from context
        cloudinaryId: public_id,                          // unique identifier in Cloudinary
        url: secure_url,                         // public file URL
        size: bytes,                              // file size in bytes
        mimeType: `${resource_type}/${format}`,       // e.g., "image/jpg"
        // uploadedAt:   created_at                          // optional extra field
      });
      return uploadRes
    } catch (e) {
      setError(e)
      console.log(e)
      throw e

    } finally {
      setLoading(false)
    }
  }, [])

  return { upload, loading, error }
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
