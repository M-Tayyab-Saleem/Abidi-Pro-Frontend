import React, { useState, useEffect } from "react";
import api from "../../axios";
import { toast } from "react-toastify";

const ApplyLeaveModal = ({ isOpen, setIsOpen, onLeaveAdded, userLeaves = {} }) => {
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [quotaError, setQuotaError] = useState("");
  const [daysRequested, setDaysRequested] = useState(0);

  const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    const startDateObj = new Date(start);
    const endDateObj = new Date(end);
    const diffTime = Math.abs(endDateObj - startDateObj);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const getLeaveBalanceKey = (leaveType) => {
    const mapping = { "PTO": "pto", "Sick": "sick" };
    return mapping[leaveType] || leaveType.toLowerCase();
  };

  useEffect(() => {
    if (leaveType && startDate && endDate) {
      const days = calculateDays(startDate, endDate);
      setDaysRequested(days);
      const balanceKey = getLeaveBalanceKey(leaveType);
      const availableBalance = userLeaves[balanceKey] || 0;

      if (days > availableBalance) {
        setQuotaError(`INSUFFICIENT LEAVE BALANCE. AVAILABLE: ${availableBalance} DAYS`);
      } else {
        setQuotaError("");
      }
    } else {
      setDaysRequested(0);
      setQuotaError("");
    }
  }, [leaveType, startDate, endDate, userLeaves]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!leaveType || !startDate || !endDate) {
      toast.error("PLEASE FILL ALL REQUIRED FIELDS.");
      return;
    }
    try {
      const payload = { leaveType, startDate, endDate, reason };
      await api.post("/leaves", payload);
      toast.success("LEAVE REQUEST SUBMITTED");
      setIsOpen(false);
      if (onLeaveAdded) onLeaveAdded();
    } catch (error) {
      toast.error(error.response?.data?.message || "FAILED TO SUBMIT");
    }
  };

  if (!isOpen) return null;

  const balanceKey = getLeaveBalanceKey(leaveType);
  const availableBalance = leaveType ? (userLeaves[balanceKey] || 0) : null;

  return (
    <div className="fixed inset-0 bg-brand-bg/80 backdrop-blur-sm z-[100] flex justify-end">
      <div className="w-full sm:w-[450px] bg-white h-full shadow-2xl flex flex-col animate-fade-left animate-duration-300">
        
        {/* HEADER - ALL CAPS */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-slate-100">
          <h2 className="text-lg font-black text-slate-800 tracking-widest uppercase">
            APPLY FOR LEAVE
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form className="p-8 flex-1 space-y-6 overflow-y-auto" onSubmit={handleSubmit}>
          
          {/* LEAVE TYPE */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">
              LEAVE TYPE*
            </label>
            <select
              className="w-full bg-brand-inner/40 border-none rounded-xl px-4 py-3.5 text-slate-700 font-medium focus:ring-2 focus:ring-brand-btnBlue/50 transition-all appearance-none"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              required
            >
              <option value="">SELECT LEAVE TYPE</option>
              <option value="PTO">PTO (PAID TIME OFF)</option>
              <option value="Sick">SICK LEAVE</option>
            </select>
            {availableBalance !== null && (
              <p className="mt-2 text-[11px] font-bold text-brand-stroke-green uppercase">
                AVAILABLE: {availableBalance} DAYS
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* START DATE */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">
                START DATE*
              </label>
              <input
                type="date"
                className="w-full bg-brand-inner/40 border-none rounded-xl px-4 py-3 text-slate-700 font-medium focus:ring-2 focus:ring-brand-btnBlue/50"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            {/* END DATE */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">
                END DATE*
              </label>
              <input
                type="date"
                className="w-full bg-brand-inner/40 border-none rounded-xl px-4 py-3 text-slate-700 font-medium focus:ring-2 focus:ring-brand-btnBlue/50"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          {daysRequested > 0 && (
            <div className="bg-brand-timer/30 p-3 rounded-lg flex justify-between items-center">
              <span className="text-[10px] font-black text-brand-stroke-blue uppercase">TOTAL REQUESTED</span>
              <span className="text-sm font-bold text-brand-stroke-blue">{daysRequested} DAYS</span>
            </div>
          )}

          {/* REASON */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">
              REASON FOR LEAVE
            </label>
            <textarea
              className="w-full bg-brand-inner/40 border-none rounded-xl px-4 py-3 text-slate-700 font-medium focus:ring-2 focus:ring-brand-btnBlue/50 resize-none"
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="ENTER REASON..."
            ></textarea>
          </div>

          {/* ERROR DISPLAY */}
          {quotaError && (
            <div className="bg-brand-badge-rose/20 p-4 rounded-xl border border-brand-stroke-red/10">
              <p className="text-[10px] font-black text-brand-stroke-red tracking-tighter uppercase text-center">
                {quotaError}
              </p>
            </div>
          )}
        </form>

        {/* FOOTER ACTIONS - ALL CAPS */}
        <div className="p-8 border-t border-slate-100 flex gap-4 bg-slate-50/50">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex-1 px-6 py-4 rounded-2xl font-black text-[11px] text-slate-400 uppercase tracking-widest hover:bg-slate-100 transition-all"
          >
            CANCEL
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={quotaError !== "" || !leaveType || !startDate || !endDate}
            className={`flex-1 px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-lg ${
              quotaError !== "" || !leaveType || !startDate || !endDate
                ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                : "bg-brand-btnGreen text-brand-stroke-green hover:opacity-90 shadow-brand-btnGreen/20"
            }`}
          >
            SUBMIT REQUEST
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplyLeaveModal;