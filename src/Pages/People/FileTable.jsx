
import { FiEye, FiDownload } from "react-icons/fi";

const FileTable = ({files,onDownload,loading, searchTerm = "" }) => {

console.log(files,"from component")
  const filtered = files.filter((f) => {
    const s = searchTerm.toLowerCase();
    return (
      f.fileName.toLowerCase().includes(s) ||
      f.sharedBy.toLowerCase().includes(s) ||
      f.category.toLowerCase().includes(s)
    );
  });

  return (
    <div className="bg-white rounded-xl shadow p-4 w-full">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border-separate border-spacing-0">
          <thead className="bg-gray-100">
            {["Files", "Shared by", "Shared on", "Category", "Actions"].map(
              (h) => (
                <th
                  key={h}
                  className="p-3 font-medium text-gray-700 border-r last:border-none border-gray-300"
                >
                  {h}
                </th>
              )
            )}
          </thead>
          <tbody>
            {filtered.length ? (
              filtered.map((file, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="p-3">{file.fileName}</td>
                  <td className="p-3">{file.sharedBy}</td>
                  <td className="p-3">{file.sharedOn}</td>
                  <td className="p-3">{file.category}</td>
                  <td className="p-3 flex items-center gap-3">
                    <button title="View" className="hover:brightness-110">
                      <FiEye className="text-lg text-purple-600" />
                    </button>
                    <button title="Download" className="hover:brightness-110">
                      <FiDownload className="text-lg text-green-600" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  {searchTerm
                    ? `No files found matching “${searchTerm}”`
                    : "No files available"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FileTable;
