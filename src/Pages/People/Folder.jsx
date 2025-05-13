import React from "react";

const mockFolders = {
  sharedWithMe: ["Development", "UI/UX", "Bootstrap"],
  sharedWithRole: ["React Projects", "Design Systems", "UI Design", "CSS File", "Word File","PDF File"]
};

const Folder = ({ activeTab, search }) => {
  const folders =
    mockFolders[activeTab]?.filter((folder) =>
      folder.toLowerCase().includes(search.toLowerCase())
    ) || [];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
      {folders.length > 0 ? (
        folders.map((folder, index) => (
          <div
            key={index}
            className="flex items-center space-x-2 p-4 bg-secondary  shadow-sm rounded-md hover:shadow-md"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/716/716784.png"
              alt="folder"
              className="w-6 h-6"
            />
            <span className="text-heading font-medium">{folder}</span>
          </div>
        ))
      ) : (
        <p className="text-gray-500 col-span-3">No folders found.</p>
      )}
    </div>
  );
};

export default Folder;


