import  { useState } from "react";
import { Box, Button, Drawer, TextField } from "@mui/material";
import { toast } from "react-toastify"; // Optional: if you're using toast
import UploadIcon from "@mui/icons-material/Upload";

const UploadModal = ({ onCreate }) => {
  const [folderName, setFolderName] = useState("");
  const [file, setFile] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleSubmit = () => {
    if (!folderName.trim()) {
      toast?.error?.("Folder name is required");
      return;
    }

    const newFolder = {
      name: folderName,
      file: file ? file.name : "",
      createdAt: new Date().toISOString(),
    };

    onCreate(newFolder);
    setFolderName("");
    setFile(null);
    setDrawerOpen(false);
  };

  const drawerContent = (
    <Box
      sx={{
        width: 350,
        padding: 3,
      }}
      role="presentation"
    >
      <h2>Create Folder</h2>
      <TextField
        label="Folder Name"
        fullWidth
        value={folderName}
        onChange={(e) => setFolderName(e.target.value)}
        margin="normal"
       
      />

      {file && <p>Selected: {file.name}</p>}
      <Button
        onClick={handleSubmit}
        sx={{ backgroundColor: "lightgrey", color: "black" }}
      >
        Create Folder
      </Button>
    </Box>
  );

  return (
    <>
      <div className="flex justify-end">
        <Button
          onClick={toggleDrawer(true)}
          startIcon={<UploadIcon />}
         sx={{backgroundColor:"bg-primary", color:"black" }}
        >
          Upload Document
        </Button>
      </div>

      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>
    </>
  );
};

export default UploadModal;
