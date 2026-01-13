import React, { useState, useRef, useEffect } from "react";
import { FiActivity } from "react-icons/fi";

const feedsData = [
  { message: "Your request was approved from admin", actionType: "status" },
  { message: "Your log request was approved by project manager" },
  { message: "You have a message", description: "Hi, Paul, our new project would start from.....", actionType: "checkin" },
  { message: "You have not checked in yet." },
];

const FeedsCard = ({ onDelete }) => {
  return (
    <div className="relative bg-white/80 backdrop-blur-sm rounded-[1.2rem] shadow-sm border border-white/40 p-3">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <FiActivity className="w-3 h-3 text-green-600" />
            <h3 className="text-[10px] font-bold text-slate-800 uppercase tracking-tight">Feeds</h3>
          </div>
          <p className="text-[9px] font-medium text-slate-500">4+ unread messages</p>
        </div>

        <button
          onClick={onDelete}
          className="text-[8px] text-slate-500 hover:text-red-500 font-medium px-1.5 py-0.5 rounded-[0.6rem] hover:bg-red-50 transition"
        >
          Remove
        </button>
      </div>

      {/* Feed list */}
      <ul className="space-y-1.5 text-[9px]">
        {feedsData.map((item, index) => (
          <li
            key={index}
            className="bg-[#E0E5EA]/30 rounded-[0.6rem] px-2 py-1.5 flex items-center justify-between gap-2"
          >
            <div className="min-w-0 flex-1">
              <span className="font-medium text-slate-700 truncate block">{item.message}</span>
              {item.description && (
                <div className="text-[8px] text-slate-500 truncate">{item.description}</div>
              )}
            </div>

            {item.actionType && (
              <button
                className={`text-[7px] px-1.5 py-0.5 rounded-[0.4rem] font-medium shrink-0 ${item.actionType === "status" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}
              >
                {item.actionType === "status" ? "View" : "Check-in"}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FeedsCard;