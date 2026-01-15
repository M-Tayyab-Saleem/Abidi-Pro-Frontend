import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search, Menu } from "lucide-react";
import { FiTrash2, FiPlus } from "react-icons/fi";
import { FaEye } from "react-icons/fa";
import { useSelector } from "react-redux";
import api from "../../axios";
import RaiseTicketModal from "../../Pages/Tickets/RaiseTicketModal";
import ViewTicketDetailsModal from "../../Pages/Tickets/ViewTicketDetailsModal";
import { toast } from "react-toastify";
import { Spin } from "antd";
import AdminTickets from "./AdminTickets";

const Ticket = () => {
  const [tickets, setTickets] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        if (!user?.email) return;
        const res = await api.get(`/tickets`);
        setTickets(res.data || []);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user]);

  useEffect(() => {
    const results = tickets.filter(
      (ticket) =>
        ticket.ticketID?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTickets(results);
    setCurrentPage(1);
  }, [searchTerm, tickets]);

  const indexOfLastTicket = currentPage * entriesPerPage;
  const indexOfFirstTicket = indexOfLastTicket - entriesPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);
  const totalPages = Math.ceil(filteredTickets.length / entriesPerPage);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tickets/${id}`);
      const updated = tickets.filter((ticket) => ticket._id !== id);
      setTickets(updated);
      toast.success("Ticket deleted successfully!");
    } catch (error) {
      console.error("Failed to delete ticket:", error);
      toast.error(error.response?.data?.message || "Failed to delete ticket");
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      opened: { color: "bg-green-100 text-green-800", label: "Open" },
      closed: { color: "bg-red-100 text-red-800", label: "Closed" },
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      "in progress": { color: "bg-blue-100 text-blue-800", label: "In Progress" }
    };

    const config = statusConfig[status?.toLowerCase()] || { color: "bg-slate-100 text-slate-800", label: status || "Unknown" };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-transparent p-2">
      {/* Header Card */}
      <div className="bg-white/90 backdrop-blur-sm rounded-[1.2rem] shadow-md border border-white/50 mb-4 p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-base font-bold text-slate-800 uppercase tracking-tight">My Tickets</h2>
            <div className="text-xs text-slate-600 flex items-center gap-1">
              <span className="font-medium">Total:</span>
              <span className="font-bold text-slate-800">{filteredTickets.length}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0 sm:w-56">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search tickets..."
                className="w-full pl-10 pr-3 py-2.5 rounded-lg shadow-sm text-sm bg-white/80 backdrop-blur-sm text-slate-700 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2.5 bg-[#64748b] text-sm font-medium text-white  rounded-full shadow-sm transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <FiPlus className="h-4 w-4" />
              Raise Ticket
            </button>
          </div>
        </div>
      </div>

      {/* Tickets Table Card */}
      <div className="bg-white/90 backdrop-blur-sm rounded-[1.2rem] shadow-md border border-white/50 overflow-hidden">
        <Spin spinning={loading}>
          <div className="w-full overflow-x-auto">
            <div className="min-w-full inline-block align-middle">
              <table className="min-w-full text-sm border-separate border-spacing-0">
                <thead>
                  <tr className="bg-slate-100/80 backdrop-blur-sm text-slate-800">
                    <th className="p-4 font-semibold text-xs uppercase tracking-wide border-b border-slate-200 text-left">
                      Ticket ID
                    </th>
                    <th className="p-4 font-semibold text-xs uppercase tracking-wide border-b border-slate-200 text-left">
                      Date
                    </th>
                    <th className="p-4 font-semibold text-xs uppercase tracking-wide border-b border-slate-200 text-left min-w-48">
                      Subject
                    </th>
                    <th className="p-4 font-semibold text-xs uppercase tracking-wide border-b border-slate-200 text-left">
                      Priority
                    </th>
                    <th className="p-4 font-semibold text-xs uppercase tracking-wide border-b border-slate-200 text-left">
                      Status
                    </th>
                    <th className="p-4 font-semibold text-xs uppercase tracking-wide border-b border-slate-200 text-left">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentTickets.length > 0 ? (
                    currentTickets.map((ticket) => (
                      <tr key={ticket._id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                        <td className="p-4 text-slate-700 font-medium" title={ticket.ticketID || ticket._id}>
                          <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">
                            {ticket.ticketID || ticket._id.slice(0, 8).toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 text-slate-600 whitespace-nowrap">
                          {new Date(ticket.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="p-4 text-slate-700 font-medium" title={ticket.subject}>
                          <div className="truncate max-w-[200px]">{ticket.subject}</div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${
                            ticket.priority === 'high' ? 'bg-red-100 text-red-800' :
                            ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {ticket.priority || 'normal'}
                          </span>
                        </td>
                        <td className="p-4">
                          <StatusBadge status={ticket.status} />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedTicket(ticket)}
                              className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition flex items-center gap-1"
                              title="View Details"
                            >
                              <FaEye className="h-4 w-4" />
                              <span className="text-xs font-medium hidden sm:inline">View</span>
                            </button>
                            <button
                              onClick={() => handleDelete(ticket._id)}
                              className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition flex items-center gap-1"
                              title="Delete"
                            >
                              <FiTrash2 className="h-4 w-4" />
                              <span className="text-xs font-medium hidden sm:inline">Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500 text-sm">
                        <div className="flex flex-col items-center gap-2">
                          <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                          </svg>
                          {searchTerm ? (
                            <p className="text-sm font-medium text-slate-500">
                              No tickets found matching "<span className="font-semibold">{searchTerm}</span>"
                            </p>
                          ) : (
                            <>
                              <p className="text-sm font-medium text-slate-500">You haven't raised any tickets yet</p>
                              <p className="text-xs text-slate-400">Click "Raise Ticket" to get started</p>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Spin>

        {/* Pagination */}
        {filteredTickets.length > entriesPerPage && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-slate-200">
            <div className="text-xs text-slate-600">
              Showing {indexOfFirstTicket + 1} to {Math.min(indexOfLastTicket, filteredTickets.length)} of {filteredTickets.length} entries
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg ${currentPage === 1 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200 transition shadow-sm'}`}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded text-xs font-medium ${currentPage === pageNum 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 transition'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg ${currentPage === totalPages 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200 transition shadow-sm'}`}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showModal && (
        <RaiseTicketModal
          onClose={() => setShowModal(false)}
          onSubmit={(newTicket) => {
            setTickets((prev) => [...prev, newTicket]);
            setShowModal(false);
          }}
        />
      )}
      {selectedTicket && (
        <ViewTicketDetailsModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
      )}
    </div>
  );
};

export default Ticket;