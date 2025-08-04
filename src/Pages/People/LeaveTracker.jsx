import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../../axios";
import AttendanceCard from "../../Components/AttendanceCard";
import { FaUmbrellaBeach, FaUserFriends, FaHospital } from "react-icons/fa";
import { HiOutlineUserRemove } from "react-icons/hi";
import HolidayTable from "../../Components/HolidayTable";
import ApplyLeaveModal from "../../Components/LeaveModal";
import LeaveSummary from "../../Components/tabs/LeaveSummary";
import LeaveRequest from "./LeaveRequest";
import AddHolidayModal from "../../Components/AddHolidayModal";
import LeaveTrackerAdmin from "./LeaveTrackerAdmin";

const LeaveTracker = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [holidayModal, setHolidayModal] = useState(false);
  const [leaves, setLeaves] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState({
    leaves: true,
    holidays: true
  });
  const [adminRefresh, setAdminRefresh] = useState(0);

  const [errorMsg, setErrorMsg] = useState("");
  const user = useSelector(state => state.auth.user);
  const [activeTab, setActiveTab] = useState(0)
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
  const handleHolidayAdded = () => {
   setAdminRefresh(i=>++i)
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
  const tabs = [{ title: "Summary" }, { title: "Leave Tracker" }]

  return (
    <div className="px-4 py-2">
      <div className="p-8 rounded-xl bg-primary">
       <div className="inline-flex flex-row flex-wrap items-center justify-center bg-white p-1 rounded-lg shadow-sm border border-gray-200">
  {tabs.map((item, index) => (
    <div key={item.title} className="flex items-center">
      {/* Tab Item */}
      <button
        className={`px-4 py-2 text-sm font-medium transition-colors duration-200
          ${activeTab === index
            ? "text-primary bg-primary/10 rounded-md"
            : "text-heading hover:text-primary hover:bg-gray-100 rounded-md"
          }`}
        onClick={() => setActiveTab(index)}
      >
        {item.title}
      </button>

      {/* Separator (not shown after last item) */}
      {index !== tabs.length - 1 && (
        <span className="w-px h-4 bg-gray-300 mx-1"></span>
      )}
    </div>
  ))}
</div>
        {
          activeTab===0?<LeaveSummary/>:null          
        }
        {
          activeTab===1?<LeaveRequest/>:null          
        }
  {/* {
          activeTab===2?<LeaveTrackerAdmin setIsOpen={setHolidayModal} key={adminRefresh} />:null          
        } */}


      </div>
      <ApplyLeaveModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onLeaveAdded={fetchLeaves}
      />
      <AddHolidayModal
          isOpen={holidayModal} 
          setIsOpen={setHolidayModal} 
          onHolidayAdded={handleHolidayAdded}
        />
    </div>
  );
};

export default LeaveTracker;