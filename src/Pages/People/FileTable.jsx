import { FiEye, FiDownload } from "react-icons/fi";

const FileTable = ({ searchTerm = "" }) => {
 
  const files = [
    {
      name: "Front end development",
      sharedBy: "Brad Mason",
      sharedOn: "06/09/2022",
      category: "Transfer Bank",
    },
    {
      name: "UI Templates",
      sharedBy: "Sanderson",
      sharedOn: "25/09/2022",
      category: "Cash on Delivery",
    },
    {
      name: "Approval for design",
      sharedBy: "Jun Redfern",
      sharedOn: "04/10/2022",
      category: "Transfer Bank",
    },
    {
      name: "Start dates of upcoming",
      sharedBy: "Miriam Kidd",
      sharedOn: "17/10/2022",
      category: "Transfer Bank",
    },
    {
      name: "UI/UX",
      sharedBy: "Dominic",
      sharedOn: "24/10/2022",
      category: "Cash on Delivery",
    },
    {
      name: "HTML CSS Files",
      sharedBy: "Shanice",
      sharedOn: "01/11/2022",
      category: "Transfer Bank",
    },
    {
      name: "Bootstrap document",
      sharedBy: "Poppy-Rose",
      sharedOn: "22/11/2022",
      category: "Transfer Bank",
    },
  ];

  // Filter files based on search term (searching name, sharedBy, and category)
  const filteredFiles = files.filter(file => {
    const searchLower = searchTerm.toLowerCase();
    return (
      file.name.toLowerCase().includes(searchLower) ||
      file.sharedBy.toLowerCase().includes(searchLower) ||
      file.category.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full bg-background text-sm rounded-lg shadow-md">
        <thead className="text-heading">
          <tr>
            <th className="text-left py-2 px-4">Files</th>
            <th className="text-left py-2 px-4">Shared by</th>
            <th className="text-left py-2 px-4">Shared on</th>
            <th className="text-left py-2 px-4">Category</th>
            <th className="text-left py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredFiles.length > 0 ? (
            filteredFiles.map((file, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-primary" : "bg-background"}
              >
                <td className="py-2 px-4">{file.name}</td>
                <td className="py-2 px-4">{file.sharedBy}</td>
                <td className="py-2 px-4">{file.sharedOn}</td>
                <td className="py-2 px-4">{file.category}</td>
                <td className="py-2 px-4 flex items-center space-x-2">
                  <button 
                    title="View" 
                    className="hover:text-purple-700 transition-colors"
                  >
                    <FiEye className="text-lg text-purple-600" />
                  </button>
                  <button 
                    title="Download"
                    className="hover:text-green-700 transition-colors"
                  >
                    <FiDownload className="text-lg text-green-600" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4 text-heading">
                {searchTerm ? (
                  `No files found matching "${searchTerm}"`
                ) : (
                  "No files available"
                )}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FileTable;