import React from 'react';
import { FaSortDown, FaPlus } from "react-icons/fa";
import SearchBar from './SearchBar';

const ProjectsTable = ({ projects, openModal }) => {
  return (
   <div className="bg-white rounded-xl shadow p-4 w-full">
      {/* Top Bar: Sort By & New Project */}
      <div className="flex justify-between items-center mb-4">
        <SearchBar/>
        {/* <button className="flex items-center gap-2 bg-[#86B2AA] text-white text-sm px-4 py-2 rounded-md hover:brightness-110">
          Sort By <FaSortDown className="text-xs" />
        </button> */}
        <button onClick={()=>openModal()} className="flex items-center gap-2 bg-[#86B2AA] text-white text-sm px-4 py-2 rounded-md hover:brightness-110">
          <FaPlus /> New Project
        </button>
      </div>

      {/* Projects Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border-separate border-spacing-0">
          <thead className="bg-gray-100">
            <tr>
              {["ID", "Project Name", "Project Owner", "No.Of User", "Status", "Start Date", "End Date"].map((header, index) => (
                <th
                  key={index}
                  className={`p-3 font-medium text-gray-700 border-r whitespace-nowrap last:border-none border-gray-300`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3 whitespace-nowrap">{project.id}</td>
                  <td className="p-3 whitespace-nowrap">{project.name}</td>
                  <td className="p-3 whitespace-nowrap">{project.owner}</td>
                  <td className="p-3 whitespace-nowrap">{project.users}</td>
                  <td className="p-3 whitespace-nowrap">{project.status}</td>
                  <td className="p-3 whitespace-nowrap">{project.startDate}</td>
                  <td className="p-3 whitespace-nowrap">{project.endDate}</td>
                </tr>
              ))
            ) : (
              [...Array(8)].map((_, index) => (
                <tr key={index} className="border-b">
                  {[...Array(7)].map((__, colIndex) => (
                    <td key={colIndex} className="p-3">
                      <div className="h-4 bg-gray-100 rounded" />
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectsTable;
