import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../../axios";
import AttendanceCard from "../../Components/AttendanceCard";
import { FaUmbrellaBeach, FaUserFriends, FaHospital } from "react-icons/fa";
import { HiOutlineUserRemove } from "react-icons/hi";
import HolidayTable from "../../Components/HolidayTable";
import ApplyLeaveModal from "../../Components/LeaveModal";

const LeaveTracker = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [leaves, setLeaves] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState({
    leaves: true,
    holidays: true
  });
  const [errorMsg, setErrorMsg] = useState("");
  const user = useSelector(state => state.auth.user);

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
    fetchLeaves();
    fetchHolidays();
  }, []);

  const leaveData = [
    {
      icon: <HiOutlineUserRemove />,
      label: "Absents",
      available: user?.absentCount || 0,
      badgeColor: "bg-red-400",
    },
    {
      icon: <FaUmbrellaBeach />,
      label: "Holidays",
      available: user?.holidayCount || 0,
      badgeColor: "bg-yellow-300",
    },
    {
      icon: <FaUserFriends />,
      label: "Personal",
      available: user?.avalaibleLeaves || 0,
      badgeColor: "bg-green-500",
    },
    {
      icon: <FaHospital />,
      label: "Sick Leave",
      available: user?.sickLeaveCount || 0,
      badgeColor: "bg-blue-500",
    },
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
    <div className="px-4 py-2">
      <div className="p-8 rounded-xl bg-primary">
        {/* Leave Summary */}
        <div className="mt-3 mb-6 bg-background px-6 py-1 rounded-md text-sm font-medium">
          <div className="flex flex-col items-center sm:flex sm:flex-row sm:justify-between sm:items-center p-4">
            <div>
              <div className="px-2 text-sm md:text-2xl sm:text-xl">
                Leave Summary
              </div>
              <div className="">
                <h1 className="px-2 text-xs font-light mt-3 ml-1">
                  Available Leaves: {user?.avalaibleLeaves || 0}
                </h1>
                <h1 className="px-2 text-xs font-light mt-2 ml-1">
                  Booked Leaves: {user?.bookedLeaves || 0}
                </h1>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(true)}
              className="bg-[#76FA9E] h-8 px-4 mt-4 rounded-lg text-xs"
            >
              Apply Now
            </button>
          </div>
        </div>

        {/* Leave Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {leaveData.map((item, index) => (
            <AttendanceCard
              key={index}
              icon={item.icon}
              title={item.label}
              value={item.available}
              badgeColor={item.badgeColor}
            />
          ))}
        </div>

        {/* Holidays Table */}
        <div className="p-4 bg-background px-6 pb-8 rounded-md text-sm font-semibold">
          <h1 className="my-2 mb-6">Holidays</h1>
          {loading.holidays ? (
            <div className="p-4 text-center">Loading holidays...</div>
          ) : errorMsg ? (
            <div className="text-red-400 px-2">{errorMsg}</div>
          ) : (
            <HolidayTable holidays={holidays} searchTerm="" />
          )}
        </div>

        {/* Applied Leaves Table */}
        <div className="p-4 mb-8 bg-background px-6 pb-8 mt-4 rounded-md text-sm font-semibold">
          <h1 className="my-2 mb-6">Applied Leaves</h1>
          {loading.leaves ? (
            <div className="text-white px-4">Loading...</div>
          ) : errorMsg ? (
            <div className="text-red-400 px-2">{errorMsg}</div>
          ) : leaves.length === 0 ? (
            <div className="text-white px-4">No leave records found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left border-separate border-spacing-0">
                <thead className="bg-primary rounded-t-lg">
                  <tr>
                    {["Date", "Leave Type", "Reason", "Duration", "Status"].map((header, index) => (
                      <th
                        key={index}
                        className={`p-3 font-medium text-white whitespace-nowrap border-r last:border-none border-gray-300
                          ${index === 0 ? "rounded-tl-lg" : ""}
                          ${index === 4 ? "rounded-tr-lg" : ""}
                        `}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {formatAppliedLeaves(leaves).map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3 whitespace-nowrap">{item.date}</td>
                      <td className="p-3 whitespace-nowrap">{item.leaveType}</td>
                      <td className="p-3 whitespace-nowrap">{item.reason}</td>
                      <td className="p-3 whitespace-nowrap">{item.duration}</td>
                      <td className={`p-3 whitespace-nowrap text-center ${item.status === "Approved" ? 'bg-completed' : 'bg-slate-500 text-white'} rounded-sm`}>
                        {item.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        
      </div>
      <ApplyLeaveModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onLeaveAdded={fetchLeaves}
      />
    </div>
  );
};

export default LeaveTracker;