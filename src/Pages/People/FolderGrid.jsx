

import React from "react";

const FolderGrid = ({ folders, searchTerm }) => {
  const filtered = folders?.filter((folder) =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 w-full">
      {filtered.length > 0 ? (
        filtered.map((folder, index) => (
          <div
            key={index}
            className="flex flex-col space-y-1 p-4 bg-secondary shadow-sm rounded-md hover:shadow-md"
          >
            <div className="flex items-center space-x-2">
              <img
                src="https://cdn-icons-png.flaticon.com/512/716/716784.png"
                alt="folder"
                className="w-6 h-6"
              />
              <h3 className="font-semibold">{folder.name}</h3>
            </div>
            <p className="text-sm text-gray-500">{folder.file}</p>
            <p className="text-xs text-gray-400">
              {new Date(folder.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-500 col-span-3 text-center">No folders found.</p>
      )}
    </div>
  );
};

export default FolderGrid;


