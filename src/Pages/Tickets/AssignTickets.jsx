"use client";

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../axios";
import { toast } from "react-toastify";
import {
  ArrowLeft, Trash2, ChevronDown, Flag, User,
  Calendar, Clock, Paperclip,
} from "lucide-react";

const AssignTicket = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const ticketData = location.state?.ticket;
  const ticketId = ticketData?._id;

  const [ticket, setTicket] = useState(null);
  const [newResponse, setNewResponse] = useState("");
  const [assignDropdownOpen, setAssignDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [selectedAssigneeId, setSelectedAssigneeId] = useState(null);
  const [adminUsers, setAdminUsers] = useState([]);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await api.get(`/tickets/${ticketId}`);
        setTicket(res.data);
        setSelectedAssigneeId(res.data.assignedTo?._id || null);
      } catch
      (error) {
        toast.error(error.response?.data?.message || "Failed to fetch ticket");
      }
    };

    const fetchAdmins = async () => {
      try {
        const res = await api.get("/users/admins");
        setAdminUsers(res.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch admins");
      }
    };

    if (ticketId) {
      fetchTicket();
      fetchAdmins();
    }
  }, [ticketId]);

  const assignToUser = async (userId) => {
    try {
      const res = await api.patch(`/tickets/${ticketId}/assign`, { assignedTo: userId });
      setTicket(res.data);
      setSelectedAssigneeId(userId);
      toast.success("Ticket assigned");
    } catch (error) {
      toast.error(`Failed to assign ticket`);
    } finally {
      setAssignDropdownOpen(false);
    }
  };

  const handlePriorityChange = async (priority) => {
    try {
      const res = await api.patch(`/tickets/${ticketId}/priority`, { priority });
      setTicket(res.data);
      toast.success("Priority updated");
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to update priority`);
    } finally {
      setStatusDropdownOpen(false);
    }
  };

  const handleSubmitResponse = async () => {
    if (newResponse.trim() === "") return;
    try {
      const res = await api.post(`/tickets/${ticketId}/response`, {
        content: newResponse,
        avatar: "👤"
      });
      setTicket(res.data);
      setNewResponse("");
      toast.success("Response submitted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit response");
    }
  };

  const handleDeleteTicket = async () => {
    try {
      await api.delete(`/tickets/${ticketId}`);
      toast.success("Ticket deleted");
      navigate("/admin/admintickets");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete ticket");
    }
  };

  const selectedAssignee = adminUsers.find((u) => u._id === selectedAssigneeId);

  if (!ticket) return <div className="p-4 text-center">Loading ticket...</div>;

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="bg-primary p-6 min-h-screen rounded-2xl m-4 w-full max-w-6xl">
        <h1 className="text-tblHead text-xl font-semibold mb-4">Tickets</h1>

        <div className="bg-background rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <button onClick={() => navigate("/admin/admintickets")} className="text-gray-600 hover:text-gray-900">
                <ArrowLeft size={20} />
              </button>

              <div className="flex-1">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-text">
                  #{ticket.ticketID || ticket._id}: {ticket.subject || ticket.title}
                  <div className="relative">
                    <button
                      onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                      className="text-xs px-2 py-1 rounded flex items-center gap-1 bg-gray-200"
                    >
                      {ticket.priority}
                      <ChevronDown size={14} />
                    </button>
                    {statusDropdownOpen && (
                      <div className="absolute right-0 mt-1 w-36 bg-white border rounded shadow z-10">
                        {["High Priority", "Medium Priority", "Low Priority"].map((level) => (
                          <button
                            key={level}
                            onClick={() => handlePriorityChange(level)}
                            className="block px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </h2>
                <div className="text-sm text-muted flex gap-2 flex-wrap">
                  <span className="flex items-center"><Clock size={14} className="mr-1" /> Created {new Date(ticket.createdAt).toLocaleString()}</span>
                  <span className="flex items-center"><Clock size={14} className="mr-1" /> Updated {new Date(ticket.updatedAt).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={handleDeleteTicket} className="text-red-500 hover:text-red-700">
                  <Trash2 size={20} />
                </button>

                <div className="relative">
                  <button
                    onClick={() => setAssignDropdownOpen(!assignDropdownOpen)}
                    className={`px-3 py-2 shadow-md rounded flex items-center gap-2 ${selectedAssignee ? "bg-green-500 text-white" : "bg-primary text-text"}`}
                  >
                    {selectedAssignee ? `Assigned to: ${selectedAssignee.name}` : "Assign"}
                    <ChevronDown size={16} />
                  </button>

                  {assignDropdownOpen && (
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border">
                      <form className="py-2 px-2 space-y-1">
                        {adminUsers.map((user) => (
                          <label key={user._id} className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedAssigneeId === user._id}
                              onChange={() => setSelectedAssigneeId(user._id)}
                              onClick={() => assignToUser(user._id)}
                            />
                            <span className="text-sm">{user.name}</span>
                          </label>
                        ))}
                        <button
                          onClick={() => setAssignDropdownOpen(!assignDropdownOpen)}
                          className={`px-3 py-2 shadow-md rounded flex items-center gap-2 ${selectedAssignee ? "bg-green-500 text-white" : "bg-primary text-text"
                            }`}
                        >
                          {selectedAssignee ? `Assigned to: ${selectedAssignee.name}` : "Assign"}
                          <ChevronDown size={16} />
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left Side */}
            <div className="lg:col-span-2 p-4">
              {/* Description */}
              <div className="mb-6 shadow-lg rounded-md p-4 bg-secondary">
                <h3 className="text-sm font-medium text-text border-b-2 mb-2">Ticket Description</h3>
                <p className="text-text">{ticket.description}</p>
              </div>

              {/* Responses */}
              <div className="mb-6 card rounded-md p-4 bg-secondary shadow-lg">
                <div className="flex justify-between items-center mb-7 border-b-2 p-1">
                  <h3 className="text-sm font-medium text-text">Responses</h3>
                  <span className="text-xs text-muted">
                    {ticket.responses?.length || 0} Responses
                  </span>
                </div>
                <div className="space-y-4">
                  {(ticket.responses || []).map((response, i) => (
                    <div key={i} className="p-1">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-lg">
                          {response.avatar || "👤"}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-semibold">{response.author}</h4>
                            <span className="text-xs text-muted">
                              {new Date(response.time).toLocaleString()}
                            </span>
                          </div>
                          <p className="mt-1">{response.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Response */}
              <div className="card p-2 bg-secondary rounded-md shadow-xl">
                <h3 className="text-sm font-medium text-muted mb-2 border-b-2 p-2">
                  Add Response
                </h3>
                <textarea
                  value={newResponse}
                  onChange={(e) => setNewResponse(e.target.value)}
                  className="w-full border rounded-md p-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Add your response here..."
                />
                <div className="flex justify-between flex-wrap gap-2 mt-3">
                  <button className="flex items-center text-gray-600 hover:text-gray-900 text-xs sm:text-sm md:text-base">
                    <Paperclip size={16} className="mr-1" />
                    Add Attachment
                  </button>
                  <button
                    onClick={handleSubmitResponse}
                    className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded"
                  >
                    Submit Response
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="p-4">
              <div className="mb-6 card bg-secondary p-4 rounded-lg shadow-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Ticket Details</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Flag size={16} />
                    <span className="font-medium">{ticket.priority}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <User size={16} />
                    <span>{selectedAssignee?.name || "Unassigned"}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar size={16} />
                    <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-secondary p-4 rounded shadow">
                <h3 className="font-medium mb-3">Activity Log</h3>
                <ul className="text-sm space-y-2">
                  {(ticket.activities || []).map((act, i) => (
                    <li key={i}>
                      {act.type === "assigned" && `Assigned to ${act.to}`}
                      {act.type === "responded" && `${act.by} responded`}
                      {act.type === "statusChanged" && `Status changed to ${act.to}`}
                      {act.type === "created" && "Ticket created"}
                      <span className="text-xs text-muted ml-2">{act.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignTicket;
