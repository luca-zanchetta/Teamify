import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import "../Css/Calendar.css";

const localizer = momentLocalizer(moment);

const events = [
  /*{
    title: "Event 1",
    start: new Date(2023, 7, 14, 10, 0),
    end: new Date(2023, 7, 14, 12, 0),
  },*/
  // Add more events...
];

const messages = {
  previous: "←",
  next: "→",
  today: "Today",
  month: "Month",
  week: "Week",
  day: "Day",
  date: "Date",
  time: "Time",
};

const WeeklyCalendar: React.FC = () => {
  const startingHour = 8;
  const timeGutterFormat = "H:mm";

  return (
    <div className="weekly-calendar-container">
      <Calendar
        localizer={localizer}
        defaultView="week" // Specify the default view
        startAccessor="start"
        endAccessor="end"
        min={new Date().setHours(startingHour, 0, 0, 0)}
        style={{ height: 600, width: 1000 }}
        events={events}
        formats={{
          timeGutterFormat,
        }}
        messages={messages}
      />
    </div>
  );
};

export default WeeklyCalendar;
