import React, { useRef, useState, useEffect } from "react";
import { FiMoreVertical, FiTrash2, FiGift } from "react-icons/fi";
import api from "../../axios";
import { toast } from "react-toastify";

const UpcomingBirthdaysCard = ({ onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [birthdays, setBirthdays] = useState([]);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef();

  useEffect(() => {
    const fetchBirthdays = async () => {
      try {
        const response = await api.get('/users/birthdays/upcoming');
        setBirthdays(response.data);
      } catch (error) {
        console.error("Failed to fetch birthdays:", error);
        toast.error("Failed to load birthday data");
      } finally {
        setLoading(false);
      }
    };

    fetchBirthdays();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (loading) {
    return (
      <div className="relative bg-background rounded-xl shadow-md p-5 pt-10 w-full min-h-[300px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="relative bg-background rounded-xl shadow-md p-5 pt-10 w-full">
      {/* Floating Icon */}
      <div className="absolute -top-4 left-4 bg-pink-100 text-pink-700 w-10 h-10 flex items-center justify-center rounded-md shadow z-99 text-xl">
        <FiGift />
      </div>

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-semibold text-heading">Upcoming Birthdays</h2>
          <p className="text-sm text-cardDescription font-medium">Celebrate your team!</p>
        </div>

        {/* Menu */}
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

      {/* List of Birthdays */}
      {birthdays.length > 0 ? (
        <ul className="space-y-3">
          {birthdays.map((b, index) => (
            <li
              key={index}
              className={`rounded-lg p-3 flex items-center justify-between group transition ${b.color}`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={b.avatar}
                  alt={b.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-heading">{b.name}</div>
                  <div className="text-xs text-text">
                    {b.date} <span className="mx-1 text-cardDescription">|</span> {b.day}
                  </div>
                </div>
              </div>

              {/* Hover Action */}
              {/* <button className="hidden group-hover:flex items-center gap-1 text-xs bg-white border border-gray-300 px-3 py-1 rounded hover:bg-gray-50 text-gray-700 transition">
                <FiGift className="w-4 h-4 text-pink-600" />
                Send Wish
              </button> */}
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-6 text-gray-500">
          No upcoming birthdays in the next 30 days
        </div>
      )}
    </div>
  );
};

export default UpcomingBirthdaysCard;