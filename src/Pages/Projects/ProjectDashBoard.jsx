import React, { useEffect } from "react";
import { BsFileEarmarkCheckFill } from "react-icons/bs";
import { MdPeople } from "react-icons/md";
import ProjectCard from "../../Components/ProjectCard";
import ProjectDashboardCards from "../../Components/ProjectDashboardCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjectDashboard } from "../../Store/projectSlice";

const ProjectDashBoard = () => {
  const dispatch = useDispatch();
  const { dashboardData, loading } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchProjectDashboard());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const leaveData = [
    {
      icon: <BsFileEarmarkCheckFill className="w-5 h-5 text-[#C8928D]" />,
      label: "Active Projects",
      available: dashboardData?.activeProjects || 0,
      badgeColor: "bg-[#FFC2C2]",
    },
    {
      icon: <BsFileEarmarkCheckFill className="w-5 h-5 text-[#EDB789]" />,
      label: "Completed Projects",
      available: dashboardData?.completedProjects || 0,
      badgeColor: "bg-[#F4D4B5]",
    },
    {
      icon: <BsFileEarmarkCheckFill className="w-5 h-5 text-[#8AC090]" />,
      label: "Opened Task",
      available: dashboardData?.openTasks || 0,
      badgeColor: "bg-[#B5F4BC]",
    },
    {
      icon: <MdPeople className="w-5 h-5 text-[#86ABEF]" />,
      label: "Project Group",
      available: dashboardData?.projectGroups || 0,
      badgeColor: "bg-[#AAC8FF]",
    },
  ];

  return (
    <div className="px-4 py-2">
      <div className="p-4 sm:p-8 rounded-xl bg-primary">
        <div className="bg-white px-4 py-3 mb-4 font-semibold rounded-lg">
          Project Dashboard
        </div>

        <div className="mt-12 flex flex-wrap gap-4 sm:gap-6">
          {leaveData.map((item, index) => (
            <div key={index} className="w-full sm:w-[48%] lg:w-[23%]">
              <ProjectCard
                title={item.label}
                value={item.available}
                icon={item.icon}
                badgeColor={item.badgeColor}
              />
            </div>
          ))}
        </div>

        <div className="mt-8">
          <ProjectDashboardCards 
            donutData={dashboardData?.donutChart} 
            barData={dashboardData?.barChart} 
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectDashBoard;