import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search, Menu } from "lucide-react";
import { FiTrash2 } from "react-icons/fi";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { title: "Raise a Ticker", component: null },
    { title: "Ticket List", component: <AdminTickets /> }
  ];
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



  return (
    <div className="bg-primary m-5 rounded-2xl min-h-[700px] p-4 md:p-2">

      <div className="text-text rounded-lg  p-4 md:p-6 min-h-[700px] ">
        {/* Tab Bar */}
        {/* <div className="inline-flex flex-row flex-wrap items-center justify-center bg-white p-1 rounded-lg shadow-sm border border-gray-200 mb-4">
          {tabs.map((item, index) => (
            <div key={item.title} className="flex items-center">
              <button
                className={`px-4 py-2 text-sm font-medium transition-colors duration-200
                ${activeTab === index
                    ? "text-primary bg-primary/10 rounded-md"
                    : "text-heading hover:text-primary hover:bg-gray-100 rounded-md"
                  }`}
                onClick={() => setActiveTab(index)}
              >
                {item.title}
              </button>
              {index !== tabs.length - 1 && (
                <span className="w-px h-4 bg-gray-300 mx-1"></span>
              )}
            </div>
          ))}
        </div> */}
        {/* {
          activeTab==0?
          <> */}
          <div className="flex flex-col space-y-4 mb-5 bg-white rounded-lg px-4 py-4 sm:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between w-full">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-3 lg:mb-0">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <label className="text-sm text-heading whitespace-nowrap">Show</label>
                <select
                  className="text-sm px-2 py-1 text-heading bg-secondary rounded-md shadow-md"
                  value={entriesPerPage}
                  onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                >
                  {[10, 25, 50, 100].map((num) => (
                    <option key={num} value={num} className="text-gray-700">
                      {num}
                    </option>
                  ))}
                </select>
                <span className="text-sm text-heading">entries</span>
              </div>

              <div className="relative w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search..."
                  className="border-0 pl-9 pr-3 py-1.5 rounded-md shadow-md w-full sm:w-64 text-sm bg-secondary text-description"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md shadow-md"
              >
                Raise a Ticket
              </button>
              <button
                className="sm:hidden p-2 border rounded bg-white shadow-md"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <Menu className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
        <Spin spinning={loading}>
          <div className="bg-white rounded-xl shadow p-4 w-full mt-5">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left border-separate border-spacing-0">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 font-medium text-gray-700 border-r border-gray-300">Ticket ID</th>
                    <th className="p-3 font-medium text-gray-700 border-r border-gray-300">Date</th>
                    <th className="p-3 font-medium text-gray-700 border-r border-gray-300">Subject</th>
                    <th className="p-3 font-medium text-gray-700 border-r border-gray-300">Email</th>
                    <th className="p-3 font-medium text-gray-700 border-r border-gray-300">Attachment</th>
                    <th className="p-3 font-medium text-gray-700 border-r border-gray-300">Status</th>
                    <th className="p-3 font-medium text-gray-700 border-r border-gray-300 hidden sm:table-cell">Description</th>
                    <th className="p-3 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTickets.length > 0 ? (
                    currentTickets.map((ticket) => (
                      <tr key={ticket._id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{ticket.ticketID || ticket._id.slice(0, 6)}</td>
                        <td className="p-3">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                        <td className="p-3">{ticket.subject}</td>
                        <td className="p-3">{ticket.emailAddress || "—"}</td>
                        <td className="p-3">
                          {ticket.attachments && ticket.attachments.length > 0 ? (
                            <span className="text-green-600 text-xs bg-green-100 rounded-full px-2 py-1 inline-block">
                              {ticket.attachments[0].name}
                            </span>
                          ) : (
                            <span className="text-gray-500 text-xs bg-gray-200 rounded-full px-2 py-1 inline-block">
                              No file
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${ticket.status === "opened"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                              }`}
                          >
                            {ticket.status}
                          </span>
                        </td>
                        <td className="p-3 hidden sm:table-cell">{ticket.description || "—"}</td>
                        <td className="p-3 flex items-center gap-3">
                          <button title="View" onClick={() => setSelectedTicket(ticket)} className="hover:brightness-110">
                            <FaEye className="text-lg text-[#7FABA4]" />
                          </button>
                          <button title="Delete" onClick={() => handleDelete(ticket._id)} className="hover:brightness-110">
                            <FiTrash2 className="text-lg text-red-400" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="p-4 text-center text-gray-500">
                        {searchTerm
                          ? `No tickets found matching “${searchTerm}”`
                          : "📭 You haven’t raised any tickets yet."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Spin>
        {/* </> */}
        {/* :null */}
        {/* } */}
        {/* {
          activeTab==1?
          tabs[activeTab].component:null
        } */}
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
    </div>
  );
};

export default Ticket;
