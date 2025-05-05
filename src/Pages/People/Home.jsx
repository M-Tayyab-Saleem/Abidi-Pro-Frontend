import React, { useState, useEffect } from "react";
import { Card, CardBody } from "@material-tailwind/react";

import FeedsCard from "../People/cards/FeedsCard";
import AttendanceCard from "../People/cards/AttendanceCard";
import HolidaysCard from "../People/cards/HolidaysCard";
import ToDoCard from "./cards/TodoCard";
import NotesCard from "./cards/NotesCard";
import AddCardMenu from "../People/cards/AddCardMenu";
import RecentActivitiesCard from "./cards/RecentActivitiesCard";
import UpcomingBirthdaysCard from "./cards/UpcomingBirthdaysCard";
import LeaveLogCard from "./cards/LeaveLogCard";

const Home = () => {
  const [time, setTime] = useState({ hours: "00", minutes: "00", period: "AM" });
  const [cards, setCards] = useState([]);
  const weeklyHours = [3, 4, 2, 6, 7, 1, 3];

  const addCard = (type) => {
    if (!cards.find((c) => c.type === type)) {
      setCards([...cards, { type, id: Date.now() }]);
    }
  };

  const removeCard = (id) => {
    setCards(cards.filter((c) => c.id !== id));
  };

  const renderCard = (card) => {
    const props = { key: card.id, onDelete: () => removeCard(card.id) };
    switch (card.type) {
      case "feeds": return <FeedsCard {...props} />;
      case "attendance":
        return <AttendanceCard weeklyData={weeklyHours} onDelete={props.onDelete} />;
      case "holidays": return <HolidaysCard {...props} />;
      case "todo": return <ToDoCard {...props} />;
      case "notes": return <NotesCard {...props} />;
      case "recent activities": return <RecentActivitiesCard {...props}/>;
      case "birthdays": return <UpcomingBirthdaysCard {...props}/>;
      case "leavelog": return <LeaveLogCard {...props} />;
      default: return null;
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

  return (
    <Card className="overflow-hidden bg-primary p-5 border m-4 shadow-sm min-h-[700px]">
      <CardBody className="bg-background rounded-lg border-0 shadow-sm flex items-center justify-between gap-4 p-3 sm:p-5 md:p-6">
        {/* Greeting */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-full bg-teal-500 text-white flex items-center justify-center text-sm sm:text-base md:text-xl font-bold">
            P
          </div>
          <div className="truncate">
            <h2 className="text-xl font-semibold truncate">Hey, Paul!</h2>
            <p className="text-gray-600 text-sm">Have a great day</p>
          </div>
        </div>

        {/* Clock */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="bg-indigo-100 text-indigo-800 px-3 py-2 rounded font-semibold text-lg">{time.hours}</div>
            <div className="text-lg font-bold">:</div>
            <div className="bg-indigo-100 text-indigo-800 px-3 py-2 rounded font-semibold text-lg">{time.minutes}</div>
            <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm ml-1">{time.period}</div>
          </div>
        </div>
      </CardBody>

      {/* Menu */}
      <div className="mt-4 text-end">
        <AddCardMenu onAdd={addCard} />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
        {cards.map(renderCard)}
      </div>
    </Card>
  );
};

export default Home;
