import React, { useState, useRef, useEffect } from "react";
import { FiMoreVertical, FiTrash2 } from "react-icons/fi";
import { FaUmbrellaBeach as BeachIcon } from "react-icons/fa";
import api from "../../axios";

const LeaveLogCard = ({ onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [leaveLogs, setLeaveLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef();

  useEffect(() => {
    const fetchLeaveLogs = async () => {
      try {
        const response = await api.get("/leaves");
        const formattedData = response.data.data
          .map((item) => ({
            name: item.employeeName,
            date: new Date(item.startDate).toLocaleDateString(),
            type: item.leaveType,
            status: item.status || "Pending",
          }))
          .slice(0, 3);
        setLeaveLogs(formattedData);
      } catch (error) {
        console.error("Failed to fetch leave logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveLogs();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (loading) {
    return (
      <div className="relative bg-white/80 backdrop-blur-sm rounded-[1.2rem] shadow-sm border border-white/40 p-3 w-full">
        <div className="flex items-center gap-1.5 mb-2">
          <BeachIcon className="w-3 h-3 text-blue-600" />
          <h3 className="text-[10px] font-bold text-slate-800 uppercase tracking-tight">Leave Logs</h3>
        </div>
        <p className="text-[9px] font-medium text-slate-500">Loading leave history...</p>
      </div>
    );
  }

  return (
    <div className="relative bg-white/80 backdrop-blur-sm rounded-[1.2rem] shadow-sm border border-white/40 p-3 w-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <BeachIcon className="w-3 h-3 text-blue-600" />
            <h3 className="text-[10px] font-bold text-slate-800 uppercase tracking-tight">Leave Logs</h3>
          </div>
          <p className="text-[9px] font-medium text-slate-500">Track your leave history</p>
        </div>

        {/* 3-dot Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 rounded-[0.4rem] hover:bg-slate-100 transition"
          >
            <FiMoreVertical className="h-3 w-3 text-slate-600" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-1 w-28 bg-white shadow-md border border-slate-200 rounded-[0.6rem] z-50">
              <button
                onClick={() => {
                  onDelete();
                  setMenuOpen(false);
                }}
                className="flex items-center w-full px-3 py-1.5 text-[9px] text-red-500 hover:bg-red-50 font-medium"
              >
                <FiTrash2 className="w-2.5 h-2.5 mr-1.5" />
                Delete Card
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Leave Logs */}
      <ul className="space-y-1.5 text-[9px]">
        {leaveLogs.length > 0 ? (
          leaveLogs.map((log, index) => (
            <li
              key={index}
              className="bg-[#E0E5EA]/30 rounded-[0.6rem] p-2 flex justify-between items-center"
            >
              <div className="flex flex-col">
                <span className="font-semibold text-slate-700">{log.name}</span>
                <span className="text-[8px] text-slate-500">{log.date}</span>
              </div>
              <div className="flex flex-col text-right text-[8px]">
                <span className="font-medium text-slate-700">{log.type}</span>
                <span
                  className={`${
                    log.status === "Approved"
                      ? "text-green-600"
                      : log.status === "Rejected"
                      ? "text-red-600"
                      : "text-amber-600"
                  } font-medium`}
                >
                  {log.status}
                </span>
              </div>
            </li>
          ))
        ) : (
          <li className="p-2 text-center text-[9px] text-slate-500">
            No leave records found
          </li>
        )}
      </ul>
    </div>
  );
};

export default LeaveLogCard;