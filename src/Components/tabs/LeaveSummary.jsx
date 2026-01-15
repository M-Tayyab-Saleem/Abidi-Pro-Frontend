import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../../axios";
import AttendanceCard from "../../Components/AttendanceCard";
import { FaMoneyBillWave, FaHospital } from "react-icons/fa";
import { MdEventAvailable } from "react-icons/md";
import HolidayTable from "../../Components/HolidayTable";
import ApplyLeaveModal from "../../Components/LeaveModal";
import { use } from "react";

const LeaveSummary = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [leaves, setLeaves] = useState([]);
    const [holidays, setHolidays] = useState([]);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState({
        leaves: true,
        holidays: true,
        userProfile: true
    });
    const [errorMsg, setErrorMsg] = useState("");
    const user = useSelector(state => state.auth.user);

    // Fetch user profile to get leave balances
    const fetchUserProfile = async () => {
        try {
            if (user?._id || user?.id) {
                const userId = user._id || user.id;
                const response = await api.get(`/users/${userId}`);
                setUserProfile(response.data);
            }
        } catch (err) {
            console.error("Failed to fetch user profile:", err);
            setErrorMsg(err.response?.data?.message || "Failed to load user profile");
        } finally {
            setLoading(prev => ({ ...prev, userProfile: false }));
        }
    };

    const fetchLeaves = async () => {
        try {
            const response = await api.get("/leaves");
            setLeaves(response.data.data);
        } catch (err) {
            console.error("Failed to fetch leaves:", err);
            setErrorMsg(err.response?.data?.message || "Failed to load leaves");
        } finally {
            setLoading(prev => ({ ...prev, leaves: false }));
        }
    };

    const fetchHolidays = async () => {
        try {
            const response = await api.get("/holidays");
            setHolidays(response.data);
        } catch (err) {
            console.error("Failed to fetch holidays:", err);
            setErrorMsg(err.response?.data?.message || "Failed to load holidays");
        } finally {
            setLoading(prev => ({ ...prev, holidays: false }));
        }
    };

    useEffect(() => {
        fetchUserProfile();
        fetchLeaves();
        fetchHolidays();
    }, []);

    // Extract leave balances from user profile
    const leaveBalances = userProfile?.leaves || {};
    
    // Calculate total leaves
    const totalLeaves = Object.values(leaveBalances).reduce((sum, balance) => sum + (balance || 0), 0);

    // Create leave data cards from the leaves object
    const leaveData = [
        {
            icon: <FaMoneyBillWave />,
            label: "PTO (Paid Time Off)",
            available: leaveBalances.pto || 0,
            badgeColor: "bg-gradient-to-r from-green-500 to-green-600",
        },
        {
            icon: <FaHospital />,
            label: "Sick Leave",
            available: leaveBalances.sick || 0,
            badgeColor: "bg-gradient-to-r from-blue-500 to-blue-600",
        }
    ];

    const formatAppliedLeaves = (data) => {
        return data.map(leave => ({
            date: new Date(leave.startDate).toLocaleDateString(),
            leaveType: leave.leaveType,
            reason: leave.reason || "-",
            duration: `${Math.ceil(
                (new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24) + 1
            )} days`,
            status: leave.status || "Pending",
        }));
    };

    return (
        <div className="min-h-screen bg-transparent p-4">
            {/* Leave Summary Header */}
            <div className="bg-white/90 backdrop-blur-sm rounded-[1.2rem] shadow-md border border-white/50 mb-6 p-4">
                <div className="flex flex-col items-center sm:flex-row sm:justify-between sm:items-center">
                    <div>
                        <div className="text-base font-bold text-slate-800 uppercase tracking-tight mb-2">
                            Leave Summary
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                                <span className="text-xs text-slate-700 font-medium">
                                    Available Leaves: <span className="font-bold text-slate-800">{userProfile?.avalaibleLeaves || 0}</span>
                                </span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                                <span className="text-xs text-slate-700 font-medium">
                                    Booked Leaves: <span className="font-bold text-slate-800">{userProfile?.bookedLeaves || 0}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(true)}
                        className="bg-[#64748b] text-white px-4 py-2.5 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all mt-4 sm:mt-0"
                    >
                        Apply Now
                    </button>
                </div>
            </div>

            {/* Leave Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {/* Total Leaves Card */}
                <div className="bg-white/90 backdrop-blur-sm rounded-[1.2rem] shadow-md border border-white/50 p-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="text-slate-700 text-sm font-medium uppercase tracking-wide">Total Leaves</div>
                        <div className="text-blue-600">
                            <MdEventAvailable size={20} />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-slate-800">{totalLeaves}</div>
                    <div className="h-1 w-full bg-gradient-to-r from-teal-500 to-teal-600 rounded-full mt-2"></div>
                </div>
                
                {/* Individual Leave Type Cards */}
                {leaveData.map((item, index) => (
                    <div key={index} className="bg-white/90 backdrop-blur-sm rounded-[1.2rem] shadow-md border border-white/50 p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="text-slate-700 text-sm font-medium uppercase tracking-wide">{item.label}</div>
                            <div className="text-slate-600">
                                {item.icon}
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-slate-800">{item.available}</div>
                        <div className={`h-1 w-full ${item.badgeColor} rounded-full mt-2`}></div>
                    </div>
                ))}
            </div>

            {/* Holidays Table */}
            <div className="bg-white/90 backdrop-blur-sm rounded-[1.2rem] shadow-md border border-white/50 p-4 mb-6">
                <h1 className="text-base font-bold text-slate-800 uppercase tracking-tight mb-4">Holidays</h1>
                {loading.holidays ? (
                    <div className="p-4 text-center">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-slate-600"></div>
                        <p className="mt-2 text-slate-600 text-xs font-medium uppercase tracking-wide">Loading holidays...</p>
                    </div>
                ) : errorMsg ? (
                    <div className="text-red-600 bg-red-50 px-4 py-3 rounded-lg text-sm font-medium">{errorMsg}</div>
                ) : (
                    <HolidayTable holidays={holidays} searchTerm="" />
                )}
            </div>

            {/* Applied Leaves Table */}
            <div className="bg-white/90 backdrop-blur-sm rounded-[1.2rem] shadow-md border border-white/50 p-4">
                <h1 className="text-base font-bold text-slate-800 uppercase tracking-tight mb-4">Applied Leaves</h1>
                {loading.leaves ? (
                    <div className="p-4 text-center">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-slate-600"></div>
                        <p className="mt-2 text-slate-600 text-xs font-medium uppercase tracking-wide">Loading leaves...</p>
                    </div>
                ) : errorMsg ? (
                    <div className="text-red-600 bg-red-50 px-4 py-3 rounded-lg text-sm font-medium">{errorMsg}</div>
                ) : leaves.length === 0 ? (
                    <div className="p-6 text-center text-slate-500 text-sm bg-slate-50/80 rounded-lg">
                        <div className="flex flex-col items-center gap-2">
                            <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                            <p className="font-medium text-slate-500">No leave records found</p>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm border-separate border-spacing-0">
                            <thead>
                                <tr className="bg-slate-100/80 backdrop-blur-sm text-slate-800">
                                    {["Date", "Leave Type", "Reason", "Duration", "Status"].map((header, index) => (
                                        <th
                                            key={index}
                                            className={`p-4 font-semibold text-xs uppercase tracking-wide border-b border-slate-200 text-left ${
                                                index === 0 ? "rounded-tl-lg" : ""
                                            } ${
                                                index === 4 ? "rounded-tr-lg" : ""
                                            }`}
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {formatAppliedLeaves(leaves).map((item, index) => (
                                    <tr key={index} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                                        <td className="p-4 text-slate-700 font-medium">{item.date}</td>
                                        <td className="p-4 text-slate-600">{item.leaveType}</td>
                                        <td className="p-4 text-slate-600">{item.reason}</td>
                                        <td className="p-4 text-slate-700 font-medium">{item.duration}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-wide ${
                                                item.status === "Approved" 
                                                    ? "bg-green-100 text-green-800" 
                                                    : item.status === "Rejected"
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                            }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            
            <ApplyLeaveModal 
                isOpen={isOpen} 
                setIsOpen={setIsOpen}
                onLeaveAdded={() => {
                    fetchLeaves();
                    fetchUserProfile();
                }}
                userLeaves={leaveBalances}
            />
        </div>
    );
};

export default LeaveSummary;