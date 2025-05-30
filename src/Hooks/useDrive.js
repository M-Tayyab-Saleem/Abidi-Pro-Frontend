// src/hooks/useDrive.js
import { useState, useEffect, useCallback } from 'react'
import api from '../axios'

/** 1️⃣ Fetch folder contents */
export function useFolderContents(folderId) {
  const [folders, setFolders] = useState([])
  const [files, setFiles]     = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const reload = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const { data } = await api.get(`/files/folders/${folderId || 'root'}/contents`)
      setFolders(data.folders)
      setFiles(data.files)
    } catch (e) {
      setError(e)
      console.log(e,"get files")
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
  const [error, setError]     = useState(null)

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
  const [error, setError]     = useState(null)

  const upload = useCallback(async ({ file, folderId, folderPath }) => {
    setLoading(true); setError(null)
    try {
      // Get signature
      const { data: signData } = await api.post('files/cloudinary/signUpload', {
        folderPath,
        publicIdBase: file.name.replace(/\.[^/.]+$/, '')
      })

      // Direct upload to Cloudinary
      const formData = new FormData()
      formData.append('file',      file)
      formData.append('api_key',   signData.apiKey)
      formData.append('timestamp', signData.timestamp)
      formData.append('signature', signData.signature)
      formData.append('folder',    signData.folder)
      formData.append('public_id', signData.public_id)

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/auto/upload`,
        { method: 'POST', body: formData }
      ).then(r => r.json()).then((r)=>console.log(r,"wow"))

      // Register in our DB
      await api.post('/files/files', {
        name:         file.name,
        folderId,
        cloudinaryId: uploadRes.public_id,
        url:          uploadRes.secure_url,
        size:         uploadRes.bytes,
        mimeType:     `${uploadRes.resource_type}/${uploadRes.format}`
      })

      return uploadRes
    } catch (e) {
      setError(e)
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
  const [error, setError]     = useState(null)

  const create = useCallback(async ({ name, parentId }) => {
    setLoading(true); setError(null)
    try {
      const { data } = await api.post('/files/folders', { name, parentId })
      return data
    } catch (e) {
      setError(e)
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  return { create, loading, error }
}
