// import React from "react";
// import { FiEye, FiDownload } from "react-icons/fi";
// import { CardBody } from "@material-tailwind/react";

// const FileTable = ({ files }) => {
//   return (
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
//             {files.map((data, index) => (
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
//             {files.length === 0 && (
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
// };

// export default FileTable;


import React from "react";
import { FiEye, FiDownload } from "react-icons/fi";

const FileTable = ({ data }) => {
  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full bg-background text-sm">
        <thead className="text-heading">
          <tr>
            <th className="text-left py-2 px-4">Files</th>
            <th className="text-left py-2 px-4">Shared by</th>
            <th className="text-left py-2 px-4">Shared on</th>
            <th className="text-left py-2 px-4">Category</th>
            <th className="text-left py-2 px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((file, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-primary" : "bg-background"}
              >
                <td className="py-2 px-4">{file.name}</td>
                <td className="py-2 px-4">{file.sharedBy}</td>
                <td className="py-2 px-4">{file.sharedOn}</td>
                <td className="py-2 px-4">{file.category}</td>
                <td className="py-2 px-4 flex items-center space-x-2">
                  <button title="View">
                    <FiEye className="text-lg text-purple-600" />
                  </button>
                  <button title="Download">
                    <FiDownload className="text-lg text-green-600" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4 text-heading">
                No data found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FileTable;

