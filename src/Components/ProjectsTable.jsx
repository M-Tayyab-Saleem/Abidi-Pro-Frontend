import React from "react";
import { FaSortDown, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import SearchBar from "./SearchBar";

const ProjectsTable = ({ projects, loading, onUpdate, onDelete, openModal }) => {
  const handleEdit = (project) => {
    // You can implement edit functionality here
    // For example, open a modal with the project data
    console.log("Edit project:", project);
  };

  const handleDelete = (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      onDelete(projectId);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <SearchBar />
        <button
          onClick={openModal}
          className="flex items-center gap-2 bg-[#86B2AA] text-white text-sm px-4 py-2 rounded-md hover:brightness-110 w-full sm:w-auto justify-center"
        >
          <FaPlus /> New Project
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border-separate border-spacing-0">
          <thead className="bg-gray-100">
            <tr>
              {["ID", "Project Name", "Project Owner", "No.Of User", "Status", "Start Date", "End Date", "Actions"].map((header, index) => (
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
            {loading ? (
              [...Array(5)].map((_, index) => (
                <tr key={index} className="border-b">
                  {[...Array(8)].map((__, colIndex) => (
                    <td key={colIndex} className="p-3">
                      <div className="h-4 bg-gray-100 rounded" />
                    </td>
                  ))}
                </tr>
              ))
            ) : projects.length > 0 ? (
              projects.map((project) => (
                <tr key={project._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 whitespace-nowrap">{project._id}</td>
                  <td className="p-3 whitespace-nowrap">{project.name}</td>
                  <td className="p-3 whitespace-nowrap">{project.projectOwner?.name || 'N/A'}</td>
                  <td className="p-3 whitespace-nowrap">{project.users?.length || 0}</td>
                  <td className="p-3 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      project.status === 'Active' ? 'bg-green-100 text-green-800' : 
                      project.status === 'Completed' ? 'bg-blue-100 text-blue-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="p-3 whitespace-nowrap">{new Date(project.startDate).toLocaleDateString()}</td>
                  <td className="p-3 whitespace-nowrap">{new Date(project.endDate).toLocaleDateString()}</td>
                  <td className="p-3 whitespace-nowrap flex gap-2">
                    <button 
                      onClick={() => handleEdit(project)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      onClick={() => handleDelete(project._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-3 text-center text-gray-500">
                  No projects found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectsTable;