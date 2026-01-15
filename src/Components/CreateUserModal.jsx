import React, { useState, useEffect, useRef } from "react";
import api from "../axios"; 
import { toast } from "react-toastify";

const CreateUserModal = ({ isOpen, setIsOpen }) => {
  const [departments, setDepartments] = useState([]);
  const [managers, setManagers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef(null);

  const initialFormState = {
    empID: "",
    name: "",
    email: "",
    password: "",
    designation: "",
    department: "",
    reportsTo: "",
    role: "Employee",
    empType: "Permanent",
    joiningDate: "",
    phoneNumber: "",
    branch: "Karachi",
    timeZone: "Asia/Karachi"
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          // MOCK DATA (Replace with your actual API calls)
          setDepartments([
            { _id: "65d4b1", name: "Software Development" },
            { _id: "65d4b2", name: "Human Resources" },
            { _id: "65d4b3", name: "Sales & Marketing" }
          ]);

          const usersRes = await api.get("/users");
          setManagers(usersRes.data);
        } catch (error) {
          console.error("Failed to fetch form data", error);
          toast.error("Could not load departments or managers.");
        }
      };
      fetchData();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post("/users", formData);
      toast.success("User created successfully!");
      setFormData(initialFormState);
      setIsOpen(false);
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to create user";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex justify-center items-center p-4 sm:p-6"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="w-full max-w-3xl bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl relative flex flex-col max-h-[95vh] animate-fadeIn overflow-hidden"
      >
        {/* Close Cross */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 sm:top-5 sm:right-6 w-10 h-10 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-50 hover:text-red-500 transition-all text-2xl font-light z-10"
        >
          &times;
        </button>

        {/* Header */}
        <div className="px-6 py-6 sm:px-10 sm:py-8 border-b border-slate-50 text-center flex-shrink-0">
          <h2 className="text-base sm:text-lg font-black text-slate-800 tracking-widest uppercase">
            CREATE NEW USER
          </h2>
        </div>

        {/* Form Body */}
        <form
          id="createUserForm"
          onSubmit={handleSubmit}
          className="p-6 sm:p-10 space-y-6 overflow-y-auto custom-scrollbar"
        >
          {/* Basic Info Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Employee ID*</label>
              <input
                type="text"
                name="empID"
                placeholder="ID"
                value={formData.empID}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 font-medium outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-slate-300"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Full Name*</label>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 font-medium outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-slate-300"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Email Address*</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 font-medium outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-slate-300"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Password*</label>
              <input
                type="password"
                name="password"
                placeholder="Min 6 chars"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 font-medium outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-slate-300"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Phone Number*</label>
              <input
                type="number"
                name="phoneNumber"
                placeholder="Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 font-medium outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-slate-300"
                required
              />
            </div>
          </div>

          <div className="py-2 flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-100"></div>
            <span className="text-[10px] font-black text-slate-300 tracking-tighter uppercase">Employment Details</span>
            <div className="flex-1 h-px bg-slate-100"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Role*</label>
              <select name="role" value={formData.role} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 font-medium outline-none appearance-none cursor-pointer">
                {["Employee", "Manager", "HR", "Admin"].map(r => <option key={r} value={r}>{r.toUpperCase()}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Designation*</label>
              <input
                type="text"
                name="designation"
                placeholder="Title"
                value={formData.designation}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 font-medium outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-slate-300"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Type*</label>
              <select name="empType" value={formData.empType} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 font-medium outline-none appearance-none cursor-pointer">
                {["Permanent", "Contractor", "Intern", "Part Time"].map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Department*</label>
              <select name="department" value={formData.department} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 font-medium outline-none cursor-pointer" required>
                <option value="">SELECT DEPT</option>
                {departments.map((dept) => <option key={dept._id} value={dept._id}>{dept.name.toUpperCase()}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Reports To</label>
              <select name="reportsTo" value={formData.reportsTo} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 font-medium outline-none cursor-pointer">
                <option value="">TOP LEVEL</option>
                {managers.map((mgr) => <option key={mgr._id} value={mgr._id}>{mgr.name.toUpperCase()}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Joining Date*</label>
              <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 font-medium outline-none" required />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Branch*</label>
              <input type="text" name="branch" placeholder="Branch" value={formData.branch} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 font-medium outline-none placeholder:text-slate-300" required />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Timezone*</label>
              <select name="timeZone" value={formData.timeZone} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 font-medium outline-none cursor-pointer">
                <option value="Asia/Karachi">KARACHI</option>
                <option value="Europe/London">LONDON</option>
                <option value="America/New_York">NEW YORK</option>
              </select>
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="px-6 py-6 sm:px-10 sm:py-8 border-t border-slate-100 flex gap-3 sm:gap-4 bg-white flex-shrink-0">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex-1 py-3 sm:py-4 font-black text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
          >
            CANCEL
          </button>
          <button
            type="submit"
            form="createUserForm"
            disabled={isLoading}
            className="flex-1 py-3 sm:py-4 bg-[#64748b] text-white rounded-2xl font-black text-[10px] sm:text-[11px] uppercase tracking-widest shadow-lg shadow-slate-100 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
          >
            {isLoading ? "CREATING..." : "CREATE USER"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateUserModal;