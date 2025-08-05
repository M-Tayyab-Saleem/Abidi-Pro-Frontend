import React, { useState, useEffect } from "react";
import { Card, CardBody } from "@material-tailwind/react";
import FeedsCard from "../../Components/home/FeedsCard";
import AttendanceCard from "../../Components/home/AttendanceCard";
import HolidaysCard from "../../Components/home/HolidaysCard";
import ToDoCard from "../../Components/home/TodoCard";
import NotesCard from "../../Components/home/NotesCard";
import AddCardMenu from "../../Components/home/AddCardMenu";
import RecentActivitiesCard from "../../Components/home/RecentActivitiesCard";
import UpcomingBirthdaysCard from "../../Components/home/UpcomingBirthdaysCard";
import LeaveLogCard from "../../Components/home/LeaveLogCard";
import UpcomingDeadlinesCard from "../../Components/home/UpcomingDeadlinesCard";
import TimeoffBalanceCard from "../../Components/home/TimeoffBalanceCard";
import TasksAssignedToMeCard from "../../Components/home/TasksAssignedToMeCard";
import { useTimeLog } from "./TimeLogContext";
import { useSelector } from "react-redux";
import api from "../../axios";
import { toast } from "react-toastify";

function format(sec) {
  const h = String(Math.floor(sec / 3600)).padStart(2, "0");
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return { h, m, s };
}

const Home = () => {
  const userInfo = useSelector((state) => state.auth.user);
  const profileImage = userInfo?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e";
  const firstName = userInfo?.name || "User";
  const [loading, setLoading] = useState(true);

  const [time, setTime] = useState({
    hours: "00",
    minutes: "00",
    period: "AM",
  });
  const [cards, setCards] = useState([]);

  const { elapsed } = useTimeLog();
  const { h, m, s } = format(elapsed);

  // Fetch user's dashboard cards
  useEffect(() => {
    const fetchDashboardCards = async () => {
      try {
        if (!userInfo?._id) return;

        setLoading(true);
        const response = await api.get(`/users/${userInfo._id}/dashboard-cards`);
        setCards(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard cards:", error);
        toast.error("Failed to load dashboard cards");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardCards();
  }, [userInfo?._id]);

  const addCard = async (type) => {
    try {
      // Check if card already exists locally first
      if (cards.some(c => c.type === type)) {
        toast.warning("This card is already added");
        return;
      }

      const response = await api.post(`/users/${userInfo._id}/dashboard-cards/add`, { type });
      setCards(response.data);
      toast.success("Card added successfully");
    } catch (error) {
      console.error("Failed to add card:", error);
      toast.error(error.response?.data?.message || "Failed to add card");
    }
  };

  const removeCard = async (cardId) => {
    try {
      await api.delete(`/users/${userInfo._id}/dashboard-cards/${cardId}`);
      setCards(cards.filter(c => c.id !== cardId));
      toast.success("Card removed successfully");
    } catch (error) {
      console.error("Failed to remove card:", error);
      toast.error("Failed to remove card");
    }
  };

  const renderCard = (card) => {
    const { id, type } = card;
    const onDelete = () => removeCard(id);

    switch (type) {
      case "feeds":
        return <FeedsCard key={id} onDelete={onDelete} />;

      case "attendance": {
        const sampleData = [
          { day: "Mon", hours: 6 },
          { day: "Tue", hours: 8 },
          { day: "Wed", hours: 4 },
          { day: "Thu", hours: 2 },
          { day: "Fri", hours: 7 },
          { day: "Sat", hours: 0 },
          { day: "Sun", hours: 5 },
        ];
        return (
          <AttendanceCard key={id} weeklyData={sampleData} onDelete={onDelete} />
        );
      }

      case "holidays":
        return <HolidaysCard key={id} onDelete={onDelete} />;

      case "todo":
        return <ToDoCard key={id} onDelete={onDelete} />;

      case "notes":
        return <NotesCard key={id} onDelete={onDelete} />;

      case "recent activities":
        return <RecentActivitiesCard key={id} onDelete={onDelete} />;

      case "birthdays":
        return <UpcomingBirthdaysCard key={id} onDelete={onDelete} />;

      case "leavelog":
        return <LeaveLogCard key={id} onDelete={onDelete} />;

      case "upcomingDeadlines":
        return <UpcomingDeadlinesCard key={id} onDelete={onDelete} />;

      case "timeoffBalance":
        return <TimeoffBalanceCard key={id} onDelete={onDelete} />;

      case "tasksAssignedToMe":
        return <TasksAssignedToMeCard key={id} onDelete={onDelete} />;

      default:
        return null;
    }
  };


  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const period = hours >= 12 ? "PM" : "AM";

      hours = hours % 12 || 12;
      setTime({ hours: hours.toString().padStart(2, "0"), minutes, period });
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="relative flex flex-col bg-clip-border rounded-xl text-gray-700 overflow-hidden bg-primary p-5 border m-4 shadow-sm min-h-[700px] border-none">
      <CardBody className="bg-background rounded-lg border-0 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 md:p-6">
        {/* Greeting */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          {profileImage ? (
            <img
              src={profileImage}
              alt={firstName}
              className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-full bg-teal-500 text-white flex items-center justify-center text-sm sm:text-base md:text-xl font-bold">
              {firstName.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="truncate">
            <h2 className="text-lg sm:text-xl text-heading font-semibold truncate">
              Hey, {firstName}!
            </h2>
            <p className="text-description text-sm">Have a great day</p>
          </div>
        </div>

        {/* Clock */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1">
            <div className="bg-indigo-100 text-indigo-800 px-3 py-1.5 sm:py-2 rounded font-semibold text-base sm:text-lg">
              {h}
            </div>
            <div className="text-base sm:text-lg font-bold">:</div>
            <div className="bg-indigo-100 text-indigo-800 px-3 py-1.5 sm:py-2 rounded font-semibold text-base sm:text-lg">
              {m}
            </div>
            <div className="text-base sm:text-lg font-bold">:</div>
            <div className="bg-indigo-100 text-indigo-800 px-3 py-1.5 sm:py-2 rounded font-semibold text-base sm:text-lg">
              {s}
            </div>
          </div>
        </div>
      </CardBody>

      {/* Menu */}
      <div className="mt-4 text-end">
        <AddCardMenu onAdd={addCard} />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
        {cards.length > 0 ? (
          cards.map(renderCard)
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500">No cards added yet. Click "More" to add cards to your dashboard.</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default Home;