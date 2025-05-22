import React, { useState, useEffect } from "react";
import {
  FaUmbrellaBeach,
  FaUserFriends,
  FaHospital,
} from "react-icons/fa";
import { HiOutlineUserRemove } from "react-icons/hi";
import ApplyLeaveModal from "../../Components/LeaveModal";
import api from "../../axios";
 
const LeaveRequest = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [leaveRecord, setLeaveRecord] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
 
  const fetchLeaves = async () => {
    try {
      const response = await api.get("/leaves"); // GET from backend
      const data = response.data.data;
 
      const formatted = data.map((leave) => ({
        date: new Date(leave.startDate).toLocaleDateString(),
        leaveType: leave.leaveType,
        reason: leave.reason || "-",
        duration: `${Math.ceil(
          (new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24) + 1
        )} days`,
        status: leave.status || "Pending",
      }));
 
      setLeaveRecord(formatted);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.response?.data?.message || "Failed to load leaves");
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    fetchLeaves();
  }, []);
 
  const leaveData = [
    {
      icon: <HiOutlineUserRemove />,
      label: "Absents",
      available: 0,
      badgeColor: "bg-red-400",
    },
    {
      icon: <FaUmbrellaBeach />,
      label: "Holidays",
      available: 10,
      badgeColor: "bg-yellow-300",
    },
    {
      icon: <FaUserFriends />,
      label: "Personal",
      available: 10,
      badgeColor: "bg-green-500",
    },
    {
      icon: <FaHospital />,
      label: "Sick Leave",
      available: 0,
      badgeColor: "bg-blue-500",
    },
  ];
 
  return (
    <div className="px-4 py-2">
      <div className="p-8 rounded-xl bg-primary">
        <h1 className="flex text-text-white font-bold text-sm">
          People/<h3 className="font-normal">Leave Tracker/Apply Leave</h3>
        </h1>
 
        <div className="mt-3 bg-background px-6 py-1 rounded-md text-sm font-medium">
          <div className="px-2 my-4 text-lg">Applied Leave</div>
 
          {loading ? (
            <div className="text-white px-4">Loading...</div>
          ) : errorMsg ? (
            <div className="text-red-400 px-4">{errorMsg}</div>
          ) : leaveRecord.length === 0 ? (
            <div className="text-white px-4">No leave records found.</div>
          ) : (
            <>
              <div className="bg-primary py-4 grid grid-cols-[1fr_2fr_2fr_3fr_1fr] rounded-t-lg text-white">
                <span className="text-center">Date</span>
                <span className="text-center">Leave Type</span>
                <span className="text-center">Reason</span>
                <span className="text-center">Duration in days</span>
                <span className="text-center">Status</span>
              </div>
 
              {leaveRecord.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-background py-4 grid grid-cols-[1fr_2fr_2fr_3fr_1fr] rounded-t-lg text-description"
                >
                  <span className="text-center">{item.date}</span>
                  <span className="text-center">{item.leaveType}</span>
                  <span className="text-center">{item.reason}</span>
                  <span className="text-center">{item.duration}</span>
                  <span
                    className={`text-center ${
                      item.status === "Approved"
                        ? "bg-completed"
                        : item.status === "Rejected"
                        ? "bg-red-400"
                        : "bg-slate-500 text-white"
                    } text-white px-2 py-1 rounded-sm`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
 
      <ApplyLeaveModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};
 
export default LeaveRequest;
 