import React, { useState, useRef } from "react";

const CreateUserModal = ({ isOpen, setIsOpen }) => {
  const [formData, setFormData] = useState({
    employeeId: "",
    name: "",
    email: "",
    designation: "",
    department: "Software Development",
    joiningDate: "",
    role: "User",
    employmentType: "Full Time",
    location: "Karachi",
    timezone: "Asia/Karachi",
  });
  const modalRef = useRef(null);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex justify-center items-center p-4 sm:p-6"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="w-full max-w-2xl bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl relative flex flex-col max-h-[90vh] animate-fadeIn overflow-hidden"
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-6 w-10 h-10 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-50 hover:text-red-500 transition-all text-2xl font-light z-10"
        >
          &times;
        </button>

        {/* HEADER */}
        <div className="px-6 py-6 sm:px-10 sm:py-8 border-b border-slate-50 text-center flex-shrink-0">
          <h2 className="text-base sm:text-lg font-black text-slate-800 tracking-widest uppercase">
            CREATE NEW USER
          </h2>
        </div>

        {/* FORM BODY */}
        <form 
          id="createUserForm"
          className="p-6 sm:p-10 overflow-y-auto custom-scrollbar flex-1"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 sm:gap-y-6">
            {[
              { label: "EMPLOYEE ID*", name: "employeeId", type: "text", placeholder: "e.g. emp-001" },
              { label: "FULL NAME*", name: "name", type: "text", placeholder: "e.g. john doe" },
              { label: "EMAIL ADDRESS*", name: "email", type: "email", placeholder: "name@company.com" },
              { label: "DESIGNATION*", name: "designation", type: "text", placeholder: "e.g. ui developer" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 font-medium outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-300 placeholder:normal-case"
                  required
                />
              </div>
            ))}

            <div>
              <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">
                JOINING DATE
              </label>
              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 font-medium outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">
                USER ROLE
              </label>
              <div className="relative">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 font-medium outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-blue-100 transition-all"
                >
                  <option value="User">USER</option>
                  <option value="Admin">ADMIN</option>
                  <option value="Manager">MANAGER</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* FOOTER ACTIONS */}
        <div className="px-6 py-6 sm:px-10 sm:py-8 border-t border-slate-100 flex gap-3 sm:gap-4 bg-white flex-shrink-0">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 py-3 sm:py-4 font-black text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
          >
            CANCEL
          </button>
          <button
            type="submit"
            form="createUserForm"
            className="flex-1 py-3 sm:py-4 bg-[#64748b] text-white rounded-2xl font-black text-[10px] sm:text-[11px] uppercase tracking-widest shadow-lg shadow-slate-100 hover:brightness-110 active:scale-95 transition-all"
          >
            CREATE USER
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateUserModal;