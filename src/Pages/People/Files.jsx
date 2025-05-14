// import React, { useState } from "react";
// import { FiEye, FiDownload } from "react-icons/fi";
// import { CardBody } from "@material-tailwind/react";
// import { FaRegFolder } from "react-icons/fa6";
// import { IoListOutline, IoFilterSharp } from "react-icons/io5";
// import { Link } from "react-router-dom";

// const Files = ({
//   data = [
//     {
//       name: "Front end development",
//       sharedBy: "Brad Mason",
//       sharedOn: "06/09/2022",
//       category: "Transfer Bank",
//     },
//     {
//       name: "UI Templates",
//       sharedBy: "Sanderson",
//       sharedOn: "25/09/2022",
//       category: "Cash on Delivery",
//     },
//     {
//       name: "Approval for design",
//       sharedBy: "Jun Redfern",
//       sharedOn: "04/10/2022",
//       category: "Transfer Bank",
//     },
//     {
//       name: "Start dates of upcoming",
//       sharedBy: "Miriam Kidd",
//       sharedOn: "17/10/2022",
//       category: "Transfer Bank",
//     },
//     {
//       name: "UI/UX",
//       sharedBy: "Dominic",
//       sharedOn: "24/10/2022",
//       category: "Cash on Delivery",
//     },
//     {
//       name: "HTML CSS Files",
//       sharedBy: "Shanice",
//       sharedOn: "01/11/2022",
//       category: "Transfer Bank",
//     },
//     {
//       name: "Bootstrap document",
//       sharedBy: "Poppy-Rose",
//       sharedOn: "22/11/2022",
//       category: "Transfer Bank",
//     },
//   ],
// }) => {
//   const [activeTab, setActiveTab] = useState("sharedWithMe");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [viewMode, setViewMode] = useState("files");

//   const folders = [
//     "Development",
//     "UI/UX",
//     "Bootstrap",
//     "React Projects",
//     "Design Systems",
//     "UI Design",
//     "CSS File",
//     "Word File",
//     "PDF File",
//   ];

//   const filteredData = data.filter((file) =>
//     file.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const renderTable = () => (
//     <div className="overflow-x-auto w-full">
//       <CardBody className="min-w-full sm:w-1/2 bg-background rounded-lg shadow-md p-3">
//         <table className="min-w-full bg-background text-sm">
//           <thead className="text-heading">
//             <tr>
//               <th className="text-left py-2 px-4">Files</th>
//               <th className="text-left py-2 px-4">Shared by</th>
//               <th className="text-left py-2 px-4">Shared on</th>
//               <th className="text-left py-2 px-4">Category</th>
//               <th className="text-left py-2 px-4">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredData.map((data, index) => (
//               <tr
//                 key={index}
//                 className={index % 2 === 0 ? "bg-primary" : "bg-background"}
//               >
//                 <td className="py-2 px-4">{data.name}</td>
//                 <td className="py-2 px-4">{data.sharedBy}</td>
//                 <td className="py-2 px-4">{data.sharedOn}</td>
//                 <td className="py-2 px-4">{data.category}</td>
//                 <td className="py-2 px-4 flex items-center space-x-2">
//                   <button title="View">
//                     <FiEye className="text-lg text-purple-600" />
//                   </button>
//                   <button title="Download">
//                     <FiDownload className="text-lg text-green-600" />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//             {filteredData.length === 0 && (
//               <tr>
//                 <td colSpan="5" className="text-center py-4 text-heading">
//                   No data found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </CardBody>
//     </div>
//   );

//   return (
//     <div className="bg-primary p-4 sm:p-6 rounded-lg shadow-md w-full h-screen">
//       {/* Tabs */}
//       {viewMode === "files" && (
//         <div className="flex space-x-2 bg-white rounded-lg overflow-hidden mb-4 w-fit">
//           <button
//             onClick={() => setActiveTab("sharedWithMe")}
//             className={`px-4 py-2 text-sm font-medium ${
//               activeTab === "sharedWithMe"
//                 ? "bg-secondary text-heading"
//                 : "bg-gray-100 text-gray-700"
//             }`}
//           >
//             Shared with me
//           </button>

//           <button
//             onClick={() => setActiveTab("sharedWithRole")}
//             className={`px-4 py-2 text-sm font-medium ml-0 ${
//               activeTab === "sharedWithRole"
//                 ? "bg-secondary text-heading"
//                 : "bg-gray-100 text-gray-700"
//             }`}
//           >
//             Shared with My Role
//           </button>
//         </div>
//       )}

//       {/* Top Controls */}
//       <div className="flex flex-col sm:flex-row sm:items-center mb-5 space-y-2 sm:space-y-0 sm:space-x-4 justify-between">
//         <div className="flex items-center space-x-2">
//           <label className="text-sm text-heading">Show</label>
//           <select className="text-sm px-2 py-1 text-heading bg-secondary rounded-md">
//             <option className="text-gray-700">10</option>
//             <option className="text-gray-700">25</option>
//             <option className="text-gray-700">50</option>
//           </select>
//           <span className="text-sm text-heading">entries</span>

//           <input
//             type="text"
//             placeholder=" Search..."
//             className="border-0 px-3 py-1.5 rounded-md w-full sm:w-64 text-sm bg-secondary text-description"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         <div className="flex items-end space-x-2">
//           <Link to="#">
//             <FaRegFolder onClick={() => setViewMode("folders")} />
//           </Link>
//           <Link to="#">
//             <IoListOutline onClick={() => setViewMode("files")} />
//           </Link>
//           <Link to="#">
//             <IoFilterSharp />
//           </Link>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex items-center justify-between mb-4">
//         {viewMode === "folders" ? (
//           <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 w-full">
//             {folders.length > 0 ? (
//               folders.map((folder, index) => (
//                 <div
//                   key={index}
//                   className="flex items-center space-x-2 p-4 bg-secondary shadow-sm rounded-md hover:shadow-md"
//                 >
//                   <img
//                     src="https://cdn-icons-png.flaticon.com/512/716/716784.png"
//                     alt="folder"
//                     className="w-6 h-6"
//                   />
//                   <span className="text-heading font-medium">{folder}</span>
//                 </div>
//               ))
//             ) : (
//               <p className="text-gray-500 col-span-3">No folders found.</p>
//             )}
//           </div>
//         ) : (
//           (activeTab === "sharedWithMe" || activeTab === "sharedWithRole") && renderTable()
//         )}
//       </div>
//     </div>
//   );
// };

// export default Files;




// import React, { useState } from "react";
// import { FiEye, FiDownload } from "react-icons/fi";
// import { CardBody } from "@material-tailwind/react";
// import { FaRegFolder } from "react-icons/fa6";
// import { IoListOutline, IoFilterSharp } from "react-icons/io5";
// import { Link } from "react-router-dom";

// const Files = () => {
//   const allFiles = [
//     {
//       name: "Front end development",
//       sharedBy: "Brad Mason",
//       sharedOn: "06/09/2022",
//       category: "Transfer Bank",
//     },
//     {
//       name: "UI Templates",
//       sharedBy: "Sanderson",
//       sharedOn: "25/09/2022",
//       category: "Cash on Delivery",
//     },
//     {
//       name: "Approval for design",
//       sharedBy: "Jun Redfern",
//       sharedOn: "04/10/2022",
//       category: "Transfer Bank",
//     },
//     {
//       name: "Start dates of upcoming",
//       sharedBy: "Miriam Kidd",
//       sharedOn: "17/10/2022",
//       category: "Transfer Bank",
//     },
//     {
//       name: "UI/UX",
//       sharedBy: "Dominic",
//       sharedOn: "24/10/2022",
//       category: "Cash on Delivery",
//     },
//     {
//       name: "HTML CSS Files",
//       sharedBy: "Shanice",
//       sharedOn: "01/11/2022",
//       category: "Transfer Bank",
//     },
//     {
//       name: "Bootstrap document",
//       sharedBy: "Poppy-Rose",
//       sharedOn: "22/11/2022",
//       category: "Transfer Bank",
//     },
//   ];

//   const folders = [
//     "Development",
//     "UI/UX",
//     "Bootstrap",
//     "React Projects",
//     "Design Systems",
//     "UI Design",
//     "CSS File",
//     "Word File",
//     "PDF File",
//   ];

//   const [activeTab, setActiveTab] = useState("sharedWithMe");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [viewMode, setViewMode] = useState("files");
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

//   // Sorting Logic
//   const sortedData = React.useMemo(() => {
//     let sortableItems = [...allFiles];
//     if (sortConfig.key) {
//       sortableItems.sort((a, b) => {
//         const valA = a[sortConfig.key].toLowerCase();
//         const valB = b[sortConfig.key].toLowerCase();
//         if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
//         if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
//         return 0;
//       });
//     }
//     return sortableItems;
//   }, [allFiles, sortConfig]);

//   const filteredData = sortedData.filter((file) =>
//     file.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleSort = (key) => {
//     let direction = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc") {
//       direction = "desc";
//     }
//     setSortConfig({ key, direction });
//   };

//   const renderTable = () => (
//     <div className="overflow-x-auto w-full">
//       <CardBody className="min-w-full bg-background rounded-lg shadow-md p-3">
//         <table className="min-w-full bg-background text-sm">
//           <thead className="text-heading">
//             <tr>
//               <th
//                 className="text-left py-2 px-4 cursor-pointer"
//                 onClick={() => handleSort("name")}
//               >
//                 Files
//               </th>
//               <th
//                 className="text-left py-2 px-4 cursor-pointer"
//                 onClick={() => handleSort("sharedBy")}
//               >
//                 Shared by
//               </th>
//               <th
//                 className="text-left py-2 px-4 cursor-pointer"
//                 onClick={() => handleSort("sharedOn")}
//               >
//                 Shared on
//               </th>
//               <th
//                 className="text-left py-2 px-4 cursor-pointer"
//                 onClick={() => handleSort("category")}
//               >
//                 Category
//               </th>
//               <th className="text-left py-2 px-4">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredData.map((data, index) => (
//               <tr
//                 key={index}
//                 className={index % 2 === 0 ? "bg-primary" : "bg-background"}
//               >
//                 <td className="py-2 px-4">{data.name}</td>
//                 <td className="py-2 px-4">{data.sharedBy}</td>
//                 <td className="py-2 px-4">{data.sharedOn}</td>
//                 <td className="py-2 px-4">{data.category}</td>
//                 <td className="py-2 px-4 flex items-center space-x-2">
//                   <button title="View">
//                     <FiEye className="text-lg text-purple-600" />
//                   </button>
//                   <button title="Download">
//                     <FiDownload className="text-lg text-green-600" />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//             {filteredData.length === 0 && (
//               <tr>
//                 <td colSpan="5" className="text-center py-4 text-heading">
//                   No data found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </CardBody>
//     </div>
//   );

//   return (
//     <div className="bg-primary p-4 sm:p-6 rounded-lg shadow-md w-full h-screen">
//       {/* Tabs */}
//       {viewMode === "files" && (
//         <div className="flex space-x-2 bg-white rounded-lg overflow-hidden mb-4 w-fit">
//           <button
//             onClick={() => setActiveTab("sharedWithMe")}
//             className={`px-4 py-2 text-sm font-medium ${
//               activeTab === "sharedWithMe"
//                 ? "bg-secondary text-heading"
//                 : "bg-gray-100 text-gray-700"
//             }`}
//           >
//             Shared with me
//           </button>
//           <button
//             onClick={() => setActiveTab("sharedWithRole")}
//             className={`px-4 py-2 text-sm font-medium ml-0 ${
//               activeTab === "sharedWithRole"
//                 ? "bg-secondary text-heading"
//                 : "bg-gray-100 text-gray-700"
//             }`}
//           >
//             Shared with My Role
//           </button>
//         </div>
//       )}

//       {/* Top Controls */}
//       <div className="flex flex-col sm:flex-row sm:items-center mb-5 space-y-2 sm:space-y-0 sm:space-x-4 justify-between">
//         <div className="flex items-center space-x-2">
//           <input
//             type="text"
//             placeholder="Search..."
//             className="border-0 px-3 py-1.5 rounded-md w-full sm:w-64 text-sm bg-secondary text-description"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//         <div className="flex items-end space-x-2">
//           <Link to="#">
//             <FaRegFolder onClick={() => setViewMode("folders")} />
//           </Link>
//           <Link to="#">
//             <IoListOutline onClick={() => setViewMode("files")} />
//           </Link>
//           <Link to="#">
//             <IoFilterSharp />
//           </Link>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex items-center justify-between mb-4">
//         {viewMode === "folders" ? (
//           <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 w-full">
//             {folders.length > 0 ? (
//               folders.map((folder, index) => (
//                 <div
//                   key={index}
//                   className="flex items-center space-x-2 p-4 bg-secondary shadow-sm rounded-md hover:shadow-md"
//                 >
//                   <img
//                     src="https://cdn-icons-png.flaticon.com/512/716/716784.png"
//                     alt="folder"
//                     className="w-6 h-6"
//                   />
//                   <span className="text-heading font-medium">{folder}</span>
//                 </div>
//               ))
//             ) : (
//               <p className="text-gray-500 col-span-3">No folders found.</p>
//             )}
//           </div>
//         ) : (
//           renderTable()
//         )}
//       </div>
//     </div>
//   );
// };

// export default Files;


import React, { useState } from "react";
import { FaRegFolder } from "react-icons/fa6";
import { IoListOutline, IoFilterSharp } from "react-icons/io5";
import FileTabs from "./FileTabs";
import FileTable from "./FileTable";
import FolderGrid from "./FolderGrid";
import { set } from "react-hook-form";

const Files = () => {
  const [activeTab, setActiveTab] = useState("sharedWithMe");
  const [viewMode, setViewMode] = useState("files");
  const [searchTerm, setSearchTerm] = useState("");

  const folders = [
    "Development",
    "UI/UX",
    "Bootstrap",
    "React Projects",
    "Design Systems",
    "UI Design",
    "CSS File",
    "Word File",
    "PDF File",
  ];

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

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-primary p-4 sm:p-6 rounded-lg shadow-md w-full h-screen">
      <FileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center mb-5 space-y-2 sm:space-y-0 sm:space-x-4 justify-between">
        <div className="flex items-center space-x-2">
          <label className="text-sm text-heading">Search</label>
          <input
            type="text"
            placeholder=" Search..."
            className="border-0 px-3 py-1.5 rounded-md w-full sm:w-64 text-sm bg-secondary text-description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-end space-x-2">
          <FaRegFolder onClick={() => setViewMode("folders")} />
          <IoListOutline onClick={() => setViewMode("files")} />
          <IoFilterSharp />
        </div>

        
      </div>

      <div className="flex justify-end">
        
        <button onClick={() => {
          setViewMode("folders")? "Upload Document" : "Upload Folder"
        }
        }> Upload Document</button>
       </div>

      {/* Main Content */}
      <div className="flex items-center justify-between mb-4">
        {viewMode === "folders" ? (
          <FolderGrid folders={folders} />
        ) : (
          <FileTable data={filteredFiles} />
        )}
      </div>
    </div>
  );
};

export default Files;








