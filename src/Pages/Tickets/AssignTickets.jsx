"use client";

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../axios";
import { toast } from "react-toastify";
import {
  ArrowLeft, Trash2, ChevronDown, Flag, User,
  Calendar, Clock, Paperclip, Check,
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await api.get(`/tickets/${ticketId}`);
        setTicket(res.data);
        setSelectedAssigneeId(res.data.assignedTo?._id || null);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch ticket");
      } finally {
        setLoading(false);
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
      toast.success("Ticket assigned successfully");
    } catch (error) {
      toast.error(`Failed to assign ticket`);
    } finally {
      setAssignDropdownOpen(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent p-2 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
          <p className="mt-3 text-slate-600 text-xs font-medium uppercase tracking-wide">Loading ticket...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-transparent p-2 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-12 h-12 text-slate-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
          </svg>
          <p className="mt-3 text-sm font-medium text-slate-500">Ticket not found</p>
          <button
            onClick={() => navigate("/admin/admintickets")}
            className="mt-4 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition"
          >
            Back to Tickets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent p-2">
      {/* Header Card */}
      <div className="bg-white/90 backdrop-blur-sm rounded-[1.2rem] shadow-md border border-white/50 mb-4 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate("/admin/admintickets")}
              className="p-2 rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 transition shadow-sm"
              title="Back to Tickets"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="truncate">
              <h2 className="text-base font-bold text-slate-800 uppercase tracking-tight truncate">
                Ticket #{ticket.ticketID || ticket._id?.slice(0, 6)}: {ticket.subject || ticket.title}
              </h2>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock size={12} />
                  Created {new Date(ticket.createdAt).toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock size={12} />
                  Updated {new Date(ticket.updatedAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDeleteTicket}
              className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition shadow-sm"
              title="Delete Ticket"
            >
              <Trash2 size={18} />
            </button>

            <div className="relative">
              <button
                onClick={() => setAssignDropdownOpen(!assignDropdownOpen)}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-sm ${
                  selectedAssignee 
                    ? "bg-green-100 text-green-800 border border-green-200" 
                    : "bg-blue-100 text-blue-800 border border-blue-200"
                } hover:brightness-95`}
              >
                <User size={16} />
                <span className="text-sm font-medium">
                  {selectedAssignee ? selectedAssignee.name : "Assign Ticket"}
                </span>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform ${
                    assignDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {assignDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg z-20 border border-white/50 overflow-hidden">
                  <div className="py-1">
                    <div className="px-3 py-2 text-xs font-medium text-slate-500 uppercase tracking-wide border-b border-slate-100">
                      Assign to Admin
                    </div>
                    {adminUsers.map((user) => (
                      <button
                        key={user._id}
                        onClick={() => assignToUser(user._id)}
                        className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-slate-50/80 transition ${
                          selectedAssigneeId === user._id ? "bg-blue-50 text-blue-700" : "text-slate-700"
                        }`}
                      >
                        {selectedAssigneeId === user._id && (
                          <Check size={14} className="text-blue-600" />
                        )}
                        <span className="font-medium">{user.name}</span>
                        <span className="text-xs text-slate-500 ml-auto uppercase tracking-wide">{user.role}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Side - 2/3 width */}
        <div className="lg:col-span-2 space-y-4">
          {/* Description Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-[1.2rem] shadow-md border border-white/50 p-4">
            <div className="mb-3">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide border-b border-slate-200 pb-2">
                Ticket Description
              </h3>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">{ticket.description}</p>
          </div>

          {/* Responses Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-[1.2rem] shadow-md border border-white/50 p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Responses</h3>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                {ticket.responses?.length || 0} RESPONSES
              </span>
            </div>
            <div className="space-y-3">
              {(ticket.responses || []).map((response, i) => (
                <div key={i} className="bg-slate-50/80 rounded-xl p-3 border border-slate-100">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-800 rounded-full text-sm font-bold">
                      {response.avatar || "👤"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-sm font-bold text-slate-800 truncate">{response.author}</h4>
                        <span className="text-xs text-slate-500 whitespace-nowrap">
                          {new Date(response.time).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed">{response.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Response Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-[1.2rem] shadow-md border border-white/50 p-4">
            <div className="mb-3">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide border-b border-slate-200 pb-2">
                Add Response
              </h3>
            </div>
            <textarea
              value={newResponse}
              onChange={(e) => setNewResponse(e.target.value)}
              className="w-full border border-slate-200 rounded-xl p-3 min-h-[120px] text-sm text-slate-700 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
              placeholder="Type your response here..."
            />
            <div className="flex justify-between items-center mt-3">
              <button className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-800 transition">
                <Paperclip size={14} />
                Add Attachment
              </button>
              <button
                onClick={handleSubmitResponse}
                disabled={!newResponse.trim()}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all shadow-sm ${
                  newResponse.trim()
                    ? "bg-[#64748b] text-white hover:brightness-110"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                Submit Response
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - 1/3 width */}
        <div className="space-y-4">
          {/* Ticket Details Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-[1.2rem] shadow-md border border-white/50 p-4">
            <div className="mb-3">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide border-b border-slate-200 pb-2">
                Ticket Details
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-100 text-red-800">
                  <Flag size={16} />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Priority</p>
                  <p className="text-sm font-bold text-slate-800">{ticket.priority}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-800">
                  <User size={16} />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Assignee</p>
                  <p className="text-sm font-bold text-slate-800">
                    {selectedAssignee?.name || "Unassigned"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 text-green-800">
                  <Calendar size={16} />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Created</p>
                  <p className="text-sm font-bold text-slate-800">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Log Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-[1.2rem] shadow-md border border-white/50 p-4">
            <div className="mb-3">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide border-b border-slate-200 pb-2">
                Activity Log
              </h3>
            </div>
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {(ticket.activities || []).map((act, i) => (
                <li key={i} className="text-sm text-slate-700 border-b border-slate-100 pb-2 last:border-0">
                  <div className="flex justify-between">
                    <span>
                      {act.type === "assigned" && `Assigned to ${act.to}`}
                      {act.type === "responded" && `${act.by} responded`}
                      {act.type === "statusChanged" && `Status changed to ${act.to}`}
                      {act.type === "created" && "Ticket created"}
                    </span>
                    <span className="text-xs text-slate-500 whitespace-nowrap">{act.time}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignTicket;