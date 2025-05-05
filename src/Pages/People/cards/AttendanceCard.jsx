// import React from "react";
// import CardWrapper from "./CardWrapper";

// const AttendanceCard = ({ onDelete }) => {
//   const hours = 28;
//   const chartBars = [3, 4, 2, 6, 7, 1, 3]; // Mocked weekly hours

//   return (
//     <CardWrapper title="Weekly Attendance" icon="📊" onDelete={onDelete}>
//       <p className="text-sm text-gray-600 mb-2">{hours} hours</p>
//       <div className="flex gap-1 items-end h-24">
//         {chartBars.map((val, i) => (
//           <div
//             key={i}
//             className="w-3 bg-green-400 rounded"
//             style={{ height: `${val * 15}px` }}
//           />
//         ))}
//       </div>
//     </CardWrapper>
//   );
// };

// export default AttendanceCard;
import React from "react";
import CardWrapper from "./CardWrapper";

const AttendanceCard = ({ weeklyData = [], onDelete }) => {
  const totalHours = weeklyData.reduce((sum, val) => sum + val, 0);
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <CardWrapper title="Weekly attendance" icon="📈" onDelete={onDelete}>
      <p className="text-md text-green-600 font-semibold mb-3">{totalHours} hours</p>
      <div className="bg-gradient-to-r from-gray-100 to-indigo-100 p-4 rounded-lg shadow">
        <div className="flex items-end justify-between h-40">
          {weeklyData.map((val, i) => {
            let color = "bg-gray-300";
            if (val <= 2) color = "bg-red-500";
            else if (val >= 7) color = "bg-green-600";
            else color = "bg-indigo-400";

            return (
              <div key={i} className="flex flex-col items-center">
                <div
                  className={`w-3 ${color} rounded`}
                  style={{ height: `${val * 10}px` }}
                ></div>
                <span className="text-xs mt-2 text-gray-600">{days[i]}</span>
              </div>
            );
          })}
        </div>
       
      </div>
    </CardWrapper>
  );
};

export default AttendanceCard;





