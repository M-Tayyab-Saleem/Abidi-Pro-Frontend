

import React, { useState } from "react";
import { Modal, Box, Button, TextField } from "@mui/material";

const UploadModal = ({ open, onClose, onCreate }) => {
  const [folderName, setFolderName] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = () => {
    const newFolder = {
      name: folderName,
      file: file ? file.name : "",
      createdAt: new Date().toISOString(),
    };

    onCreate(newFolder);
    setFolderName("");
    setFile(null);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 400,
          bgcolor: "white",
          p: 4,
          mx: "auto",
          mt: "20vh",
          borderRadius: 2,
          outline: "none",
          
         
        }}
      >
        <h2>Create Folder</h2>
        <TextField
          label="Folder Name"
          fullWidth
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          margin="normal"
        />
        <Button component="label" variant="contained" sx={{ my: 2 , mx:3}}>
          Upload File
          <input type="file" hidden onChange={(e) => setFile(e.target.files[0])} />
        </Button>
        {file && <p>Selected: {file.name}</p>}
        <Button variant="contained" onClick={handleSubmit} >
          Create Folder
        </Button>
      </Box>
    </Modal>
  );
};

export default UploadModal;

