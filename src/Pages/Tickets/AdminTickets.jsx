import React, { useState } from "react";
import { Search, Clock, Filter, SortDesc, Plus } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";
import AdminRaiseTicketModal from "../../Pages/Tickets/AdminRaiseTicketModal";
import { useNavigate } from "react-router-dom";



const AdminTickets = () => {
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [showModal, setShowModal] = useState(false); // ✅ modal state

  const navigate = useNavigate();

  const [tickets, setTickets] = useState([
    {
      id: "#0015",
      title: "Check in or check out issue",
      priority: "High Priority",
      priorityColor: "bg-red-100 text-red-700",
      date: "1 day ago",
      assignee: "Aliya",
      status: "In Progress",
    },
    {
      id: "#0016",
      title: "Request for Laptop Support",
      priority: "Low",
      priorityColor: "bg-green-100 text-green-700",
      date: "22 May 2025",
      assignee: "Aliya",
      status: "Opened",
    },
  ]);

  const handleNewTicketSubmit = (newTicket) => {
    setTickets((prev) => [...prev, newTicket]);
    setShowModal(false);
  };

  return (
    <div className="bg-primary p-6 min-h-screen rounded-2xl m-4">
      <div className="bg-background p-6 rounded-xl shadow-md overflow-auto">
        {/* Header Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 whitespace-nowrap">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap text-sm">Show</label>
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              {[10, 25, 50].map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
            <span className="whitespace-nowrap text-sm">entries</span>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto flex-grow sm:flex-grow-0">
              <input
                type="text"
                placeholder="Search..."
                className="w-full border border-gray-300 rounded pl-8 pr-3 py-2 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="bg-primary text-white px-3 py-2 rounded hover:bg-[#4b7f7a] transition text-sm flex items-center gap-1 whitespace-nowrap"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Ticket</span>
            </button>

            <div className="relative">
              <button
                onClick={() => {
                  setFilterOpen(!filterOpen);
                  setSortOpen(false);
                }}
                className="border border-gray-300 px-3 py-2 rounded text-sm flex items-center gap-1"
              >
                <Filter className="h-4 w-4" />
              </button>
              {filterOpen && (
                <div className="absolute right-0 mt-2 w-30 bg-white border rounded shadow-md z-20">
                  <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                    High Priority
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                    Low Priority
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => {
                  setSortOpen(!sortOpen);
                  setFilterOpen(false);
                }}
                className="border border-gray-300 px-3 py-2 rounded text-sm flex items-center gap-1"
              >
                <SortDesc className="h-4 w-4" />
              </button>
              {sortOpen && (
                <div className="absolute right-0 mt-2 w-30 bg-white border rounded shadow-md z-20">
                  <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                    Newest
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                    Oldest
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left table-fixed">
            <thead>
              <tr className="bg-[#5B908B] text-white">
                <th className="px-4 py-3 w-1/3 text-left">Ticket</th>
                <th className="px-4 py-3 w-1/3 text-center">Assignee</th>
                <th className="px-4 py-3 w-1/3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-4 text-left w-1/3 whitespace-nowrap">
                    <div className="font-medium text-gray-800">{ticket.title}</div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-600 whitespace-nowrap">
                      <span className="text-gray-500">{ticket.id}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${ticket.priorityColor}`}
                      >
                        {ticket.priority}
                      </span>
                      <span className="flex items-center gap-1 text-gray-500">
                        <Clock className="w-4 h-4" />
                        {ticket.date}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center w-1/3 whitespace-nowrap">
                    <div className="flex justify-center items-center gap-2">
                      <FaUserCircle className="text-gray-600 w-6 h-6" />
                      <span>{ticket.assignee}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right w-1/3 whitespace-nowrap">
                    <div className="flex justify-end items-center gap-3">
                      <select className="border rounded px-2 py-1 text-xs">
                        <option>Opened</option>
                        <option>In Progress</option>
                        <option>Closed</option>
                      </select>
                      
<button
  onClick={() => navigate(`/admin/assign-ticket/${ticket.id.replace("#", "")}`, { state: { ticket } })}
  className="border border-gray-300 px-3 py-1 rounded text-sm"
>
  Assign
</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <AdminRaiseTicketModal
            onClose={() => setShowModal(false)}
            onSubmit={handleNewTicketSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default AdminTickets;
