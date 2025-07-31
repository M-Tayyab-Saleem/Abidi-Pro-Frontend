import React, { useState } from "react";
import holidayApi from "../api/holidayApi";

const AddHolidayModal = ({ isOpen, setIsOpen, onHolidayAdded }) => {
  const [formData, setFormData] = useState({
    holidayName: "",
    holidayType: "",
    date: "",
    isRecurring: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Calculate day name from the date
      const dateObj = new Date(formData.date);
      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
      
      const holidayData = {
        ...formData,
        day: dayName
      };

      await holidayApi.createHoliday(holidayData);
      onHolidayAdded(); // Refresh the holiday list
      setIsOpen(false); // Close modal
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create holiday");
      console.error("Error creating holiday:", err);
    } finally {
      setLoading(false);
    }
  };

  const holidayTypes = [
    "National",
    "Regional",
    "Religious",
    "Company-Specific"
  ];

  const commonHolidayNames = [
    "New Year's Day",
    "Labor Day",
    "Independence Day",
    "Christmas Day",
    "Thanksgiving",
    "Eid al-Fitr",
    "Diwali",
    "Holi"
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-[9999] flex justify-end">
          <div className="w-75 sm:w-1/2 bg-white h-full p-6 shadow-lg rounded-l-lg relative z-80">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add Holiday</h2>
              <button
                className="text-gray-500 hover:text-black text-xl"
                onClick={() => setIsOpen(false)}
                disabled={loading}
              >
                &times;
              </button>
            </div>

            {error && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Holiday Name*
                </label>
                <input
                  list="holidayNames"
                  name="holidayName"
                  value={formData.holidayName}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
                <datalist id="holidayNames">
                  {commonHolidayNames.map(name => (
                    <option key={name} value={name} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Holiday Type*
                </label>
                <select
                  name="holidayType"
                  value={formData.holidayType}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="">Select type</option>
                  {holidayTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date*
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>


              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isRecurring"
                  name="isRecurring"
                  checked={formData.isRecurring}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    isRecurring: e.target.checked
                  }))}
                  className="mr-2"
                />
                <label htmlFor="isRecurring" className="text-sm text-gray-700">
                  Recurring every year
                </label>
              </div>

              <button
                type="submit"
                className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddHolidayModal;