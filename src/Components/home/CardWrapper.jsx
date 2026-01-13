import React from "react";

const CardWrapper = ({ title, icon, children, onDelete }) => (
  <div className="relative bg-white/80 backdrop-blur-sm rounded-[1.2rem] shadow-sm border border-white/40 p-3">
    <div className="flex justify-between items-start mb-2">
      <div className="flex items-center gap-1.5">
        <span className="text-slate-700 text-xs">{icon}</span>
        <h3 className="text-[10px] font-bold text-slate-800 uppercase tracking-tight">{title}</h3>
      </div>
      <button
        onClick={onDelete}
        className="text-[8px] text-slate-500 hover:text-red-500 font-medium px-1.5 py-0.5 rounded-[0.6rem] hover:bg-red-50 transition"
      >
        Remove
      </button>
    </div>
    {children}
  </div>
);

export default CardWrapper;