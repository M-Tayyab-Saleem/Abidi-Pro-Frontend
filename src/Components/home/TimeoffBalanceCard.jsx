import React, { useState, useRef, useEffect } from "react";
import { FiMoreVertical, FiTrash2, FiCalendar } from "react-icons/fi";
import axios from "axios";

const TimeoffBalanceCard = ({ onDelete, userId }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [timeOffData, setTimeOffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef();

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await axios.get(`/users/${userId}/leaves`);
        const leaves = response.data;
        
        // Create the data structure with fallback values for each leave type
        const leaveTypes = [
          {
            type: "Paid Leave",
            remaining: `${leaves.paid || 0} days`,
          },
          {
            type: "Sick Leave",
            remaining: `${leaves.sick || 0} days`,
          },
          {
            type: "Majlis Leave",
            remaining: `${leaves.majlis || 0} days`,
          }
        ];
        
        setTimeOffData(leaveTypes);
      } catch (error) {
        console.error("Error fetching leaves:", error);
        // Fallback data if API fails
        setTimeOffData([
          {
            type: "Paid Leave",
            remaining: "3 days",
          },
          {
            type: "Sick Leave",
            remaining: "4 days",
          },
          {
            type: "Majlis Leave",
            remaining: "5 days",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return <div className="bg-background rounded-xl shadow-md p-5 pt-10">Loading...</div>;
  }

  return (
    <div className="relative bg-background rounded-xl shadow-md p-5 pt-10 overflow-visible">
      {/* Icon top left */}
      <div className="absolute -top-4 left-4 bg-blue-200 text-blue-800 w-10 h-10 flex items-center justify-center rounded-md shadow z-99">
        <FiCalendar className="text-xl" />
      </div>

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg text-text font-semibold">Available Leaves</h2>
          <p className="text-cardDescription text-sm font-medium">
            Updated leave availability
          </p>
        </div>

        {/* Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-md hover:bg-gray-100 transition"
          >
            <FiMoreVertical className="h-5 w-5 text-gray-600" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-md border rounded-md z-50">
              <button
                onClick={() => {
                  onDelete();
                  setMenuOpen(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
              >
                <FiTrash2 className="w-4 h-4 mr-2" />
                Delete Card
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Leave types list */}
      <ul className="space-y-2 text-sm">
        {timeOffData.map((item, index) => (
          <li
            key={index}
            style={{ backgroundColor: "rgba(var(--color-primary-rgb), 0.3)" }}
            className="bg-primary rounded px-4 py-3 flex items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <span className="font-medium text-text">{item.type}</span>
              <div className="text-description text-sm">{item.remaining}</div>
            </div>

            {item.action && (
              <button className="text-xs px-3 py-1 rounded font-medium shrink-0 bg-blue-100 text-blue-700">
                {item.action}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TimeoffBalanceCard;