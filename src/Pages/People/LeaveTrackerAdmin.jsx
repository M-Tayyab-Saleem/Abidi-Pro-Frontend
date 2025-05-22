import React, { useEffect, useState } from "react";
import api from "../../axios";
import StatusDropDown from "../../Components/StatusDropDown";
 
const LeaveTrackerAdmin = () => {
  const [departmentLeaveRecord, setDepartmentLeaveRecord] = useState([]);
  const [loading, setLoading] = useState(true);
 
  const fetchLeaves = async () => {
    try {
      const response = await api.get("/leaves");
      const formatted = response.data.data.map((item) => ({
        id: item._id,
        date: new Date(item.startDate).toLocaleDateString(),
        name: item.employeeName,
        email: item.email,
        leaveType: item.leaveType,
        reason: item.reason || "-",
        duration: `${Math.ceil(
          (new Date(item.endDate) - new Date(item.startDate)) /
            (1000 * 60 * 60 * 24) +
            1
        )} days`,
        status: item.status || "Pending",
      }));
      setDepartmentLeaveRecord(formatted);
    } catch (err) {
      console.error("Failed to fetch leaves:", err);
    } finally {
      setLoading(false);
    }
  };
 
  const handleStatusChange = async (leaveId, newStatus) => {
    try {
      await api.put(`/leaves/${leaveId}/status`, { status: newStatus });
      await fetchLeaves();
    } catch (error) {
      console.error(
        "Failed to update status:",
        error.response?.data || error.message
      );
    }
  };
 
  useEffect(() => {
    fetchLeaves();
  }, []);
 
  return (
    // MainBody
    <div className="px-4 py-2">
      {/* roundercorner main Content */}
      <div className="p-8 rounded-xl bg-primary">
        {/* Route */}
        {/* <h1 className='flex text-text-white font-bold text-sm'>
                    People/<h3 className='font-normal'>Leave Tracker/Summary</h3>
                </h1> */}
        {/* Top Tab */}
        {/* <div className='flex mt-2 bg-background px-6 py-1 w-60 rounded-md items-center justify-around text-xs'>
                    <span className='px-2'>Summary</span>
                    <div className='w-[1px] h-8 bg-black'></div>
                    <span className='px-2'>Leave Request</span>
                </div> */}
        {/* LeaveSummaryDiv */}
        {/* <div className='mt-3 bg-background px-6 py-1  rounded-md text-sm font-medium'>
                    <div className='flex justify-between items-center align-bottom '>
                        <div>
                            <div className='px-2 text-lg'>Leave Summary</div>
                            <div className=''>
                                <h1 className='px-2 text-xs font-light mt-3 ml-1'>Available Leaves        :   02</h1>
                                <h1 className='px-2 text-xs font-light mt-2 ml-1 '>Booked Leaves        :   20</h1>
                            </div>
                        </div>
                        <button className='bg-[#76FA9E] h-8 px-4 rounded-lg text-xs'>Apply Now</button>
                    </div>
 
                </div> */}
        {/* attendance summary card view horizontal */}
        {/* Route */}
        <h1 className="flex text-text-white font-bold text-sm">
          People/<h3 className="font-normal">Leave Tracker/Admin</h3>
        </h1>
 
        <div className="mt-3 bg-background px-6 py-1  rounded-md text-sm font-medium">
          <div className="px-2 my-4 text-lg">Applied Leave</div>
          <div className="bg-primary py-4 grid grid-cols-[1fr_1fr_1fr_2fr_1fr_1fr_1fr_1fr] rounded-t-lg text-white">
            <span className="text-center">Date</span>
            <span className="text-center">Id</span>
            <span className="text-center">Name</span>
            <span className="text-center">Email</span>
            <span className="text-center">Leave Type</span>
            <span className=" whitespace-normal break-words px-2">Reason</span>
            <span className="text-center">Duration in days</span>
            <span className="text-center">Status</span>
          </div>
          {departmentLeaveRecord.map((item, index) => (
            <div
              key={item.id}
              className="bg-background py-4 grid grid-cols-[1fr_1fr_1fr_2fr_1fr_1fr_1fr_1fr] rounded-t-lg text-description"
            >
              <span className="text-center">{item.date}</span>
              <span className="text-center">{item.id.slice(-4)}</span>
              <span className="text-center">{item.name}</span>
              <span className="text-center">{item.email}</span>
              <span className="text-center">{item.leaveType}</span>
              <span className="text-center whitespace-normal break-words px-2">
                {item.reason}
              </span>
              <span className="text-center">{item.duration}</span>
              <StatusDropDown
                status={item.status}
                onChange={(newStatus) => handleStatusChange(item.id, newStatus)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
 
export default LeaveTrackerAdmin;
 
 