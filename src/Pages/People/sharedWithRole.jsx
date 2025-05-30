

// src/components/Role.jsx
import React, { useState } from 'react'
import { FaRegFolder }    from 'react-icons/fa6'
import { IoListOutline, IoFilterSharp } from 'react-icons/io5'
import { Spin, Alert }    from 'antd'
import FileTable         from './FileTable'
import FolderGrid        from './FolderGrid'
import OpenFolderScreen  from './OpenFolderScreen'
import api               from '../../axios'

export default function Role() {
  const [viewMode, setViewMode]     = useState('table')
  const [searchTerm, setSearchTerm] = useState('')
  const [openedFolder, setOpenedFolder] = useState(null)
  const folderId   = openedFolder?.id || 'root'
  const [folders, setFolders] = useState([])
  const [files, setFiles]     = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  // custom fetch for role-shared
  const reload = async () => {
    setLoading(true); setError(null)
    try {
      const { data } = await api.get(`files/folders/${folderId}/contents`)
      console.log(data)
      setFolders(data.folders)
      setFiles(data.files)
    } catch (e) {
      setError(e)
      console.log(e.response.data)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => { reload() }, [folderId])

  if (error) return <Alert message={error.message} type="error" />

  if (openedFolder) {
    return <OpenFolderScreen
      folder={openedFolder}
      onClose={() => setOpenedFolder(null)}
    />
  }

  return (
    <div className="...">
      <Spin spinning={loading}>
        {viewMode === 'grid'
          ? <FolderGrid
              folders={folders.filter(f => true)}
              onOpenFolder={(f) => setOpenedFolder(f)}
            />
          : <FileTable
              files={files.filter(f => true)}
              onDownload={(id) => {/* maybe files shared with role are public? */}
              }
            />
        }
      </Spin>
    </div>
  )
}



