import { useEffect, useState } from 'react';
import holidayApi from '../api/holidayApi';

const HolidayTable = ({ searchTerm = "" }) => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const data = await holidayApi.getAllHolidays();
        setHolidays(data);
      } catch (error) {
        console.error("Error fetching holidays:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHolidays();
  }, []);

  const today = new Date();
  const isMatch = (holiday) => {
    const s = searchTerm.toLowerCase();
    return (
      holiday.holidayName.toLowerCase().includes(s) ||
      holiday.day.toLowerCase().includes(s) ||
      new Date(holiday.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).toLowerCase().includes(s)
    );
  };

  const upcomingHolidays = holidays
    .filter(h => new Date(h.date) >= today)
    .filter(isMatch)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const pastHolidays = holidays
    .filter(h => new Date(h.date) < today)
    .filter(isMatch)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const renderTable = (title, data) => (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border-separate border-spacing-0">
          <thead className="bg-gray-100">
            <tr>
              {["Date", "Day", "Holiday Name", "Type"].map((header) => (
                <th
                  key={header}
                  className="p-3 font-medium text-gray-700 border-r last:border-none border-gray-300"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length ? (
              data.map((holiday, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    {new Date(holiday.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="p-3">{holiday.day}</td>
                  <td className="p-3">{holiday.holidayName}</td>
                  <td className="p-3">{holiday.holidayType}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  {searchTerm
                    ? `No ${title.toLowerCase()} found matching "${searchTerm}"`
                    : `No ${title.toLowerCase()} available`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) {
    return <div className="p-4 text-center">Loading holidays...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 w-full">
      {renderTable("Upcoming Holidays", upcomingHolidays)}
      {renderTable("Past Holidays", pastHolidays)}
    </div>
  );
};

export default HolidayTable;
