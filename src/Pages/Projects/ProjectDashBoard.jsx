import React from 'react'
import AttendanceCard from '../../Components/AttendanceCard';
import { HiOutlineUserRemove } from 'react-icons/hi';
import { FaHospital, FaUmbrellaBeach, FaUserFriends } from 'react-icons/fa';

const ProjectDashBoard = () => {

   const leaveData = [
      {
        icon: <HiOutlineUserRemove />,
        label: 'Active Projects',
        available: 0,
        badgeColor: 'bg-red-400',
      },
      {
        icon: <FaUmbrellaBeach />,
        label: 'Completed Projects',
        available: 10,
        badgeColor: 'bg-yellow-300',
      },
      {
        icon: <FaUserFriends />,
        label: 'Opened Task',
        available: 10,
        badgeColor: 'bg-green-500',
      },
      {
        icon: <FaHospital />,
        label: 'Project Group',
        available: 0,
        badgeColor: 'bg-blue-500',
      },
      // {
      //   icon: <FaTools />,
      //   label: 'Compensatory',
      //   available: 0,
      //   badgeColor: 'bg-purple-400',
      // },
    ];

  return (
    // MainBody
    <div className='px-4 py-2 '>
      {/* roundercorner main Content */}
      <div className='p-8 rounded-xl bg-primary'>
      <div className='bg-white px-8 py-4 font-semibold rounded-lg'>Project</div>
       {/* attendance summary card view horizontal */}
              <div className='my-6 flex flex-wrap items-start justify-start gap-6 '>
                {
                  leaveData.map((item, index) => {
                    return (
                      <AttendanceCard title={item.label} value={item.available} icon={item.icon} badgeColor={item.badgeColor} />
                    )
                  })
                }
              </div>
      </div>    
    </div>
  )
}

export default ProjectDashBoard
