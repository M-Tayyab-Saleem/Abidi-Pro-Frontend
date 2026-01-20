import React, { useState, useEffect } from 'react'
import { BsFileEarmarkCheckFill } from "react-icons/bs";
import { MdPeople } from "react-icons/md";
import AdminDashboardCards from '../../Components/AdminDashboardCard';
import api from "../../axios";
import Toast from "../../Components/Toast";

const AdminDashBoard = () => {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Toast Helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Placeholder for fetching actual dashboard stats
  const fetchStats = async () => {
    setLoading(true);
    try {
      // Example API call: 
      // const res = await api.get('/admin/stats');
      // Update your statsData state here if needed
      
      // showToast('Dashboard stats updated'); 
    } catch (error) {
      showToast('Failed to fetch dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const donutData = {
    labels: ['Completed', 'Remaining'],
    datasets: [{
      data: [80, 20],
      backgroundColor: ['#93C5FD', '#E5E7EB'],
      hoverOffset: 4,
    }],
  };

  const barData = {
    labels: ['Software', 'IT', 'Sales', 'HR'],
    datasets: [{
      data: [40, 25, 30, 20],
      backgroundColor: '#BFDBFE',
      borderRadius: 4,
      barThickness: 30,
    }],
  };

  const statsData = [
    {
      icon: <BsFileEarmarkCheckFill className="w-4 h-4 text-[#C8928D]" />,
      label: 'Users',
      value: 0,
      subText: 'Total users'
    },
    {
      icon: <BsFileEarmarkCheckFill className="w-4 h-4 text-[#EDB789]" />,
      label: 'Apps',
      value: 10,
      subText: 'Applications'
    },
    {
      icon: <BsFileEarmarkCheckFill className="w-4 h-4 text-[#8AC090]" />,
      label: 'Groups',
      value: 10,
      subText: 'Active groups'
    },
    {
      icon: <MdPeople className="w-4 h-4 text-[#86ABEF]" />,
      label: 'Work Location',
      value: 0,
      subText: 'Work locations'
    },
  ];

  return (
    <div className="min-h-screen bg-transparent p-2">
      {/* Toast Component */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Main content area */}
      <div className="space-y-4">
        
        {/* Dashboard Header Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-[1.2rem] shadow-md border border-white/50 p-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-base font-bold text-slate-800 uppercase tracking-tight">Admin Dashboard</h2>
              <p className="text-[10px] font-medium text-slate-500 mt-1">System overview and statistics</p>
            </div>
            {loading && (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            )}
          </div>
        </div>

        {/* Stats Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {statsData.map((item, index) => (
            <div 
              key={index}
              className="relative bg-white/90 backdrop-blur-sm rounded-[1.2rem] shadow-md border border-white/50 p-4"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {item.icon}
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight">{item.label}</h3>
                  </div>
                  <p className="text-[10px] font-medium text-slate-500">{item.subText}</p>
                </div>
              </div>

              {/* Value Display */}
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-slate-800">{item.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-[1.2rem] shadow-md border border-white/50 p-4">
          <AdminDashboardCards donutData={donutData} barData={barData} />
        </div>
      </div>
    </div>
  )
}

export default AdminDashBoard;