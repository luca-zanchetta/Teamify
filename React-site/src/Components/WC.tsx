import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import "../Css/Calendar.css";
import axios from "axios";

var endpoint = "http://localhost:5000/tasks";

const localizer = momentLocalizer(moment);

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

//a way to modify the visualizzation of the event

const WeeklyCalendar: React.FC = () => {
  const startingHour = 8;
  const timeGutterFormat = "H:mm";
  const [events, setEvents] = useState([]);
  const localUser = localStorage.getItem("user");

  const EventDisplay = ({ event }) => {
    return (
      <div className="custom-event" style={event.style}>
        {event.title}
      </div>
    );
  };

  //request to get the list of tasks related to the current user
  useEffect(() => {
    axios
      .get("/tasks", {
        params: {
          user: localUser,
        },
      })
      .then((response) => {
        const tasks = response.data;

        const formattedEvents: Task[] = tasks.map((task: any) => ({
          title: task.title,
          start: new Date(task.start),
          end: new Date(task.end),
        }));

        setEvents(formattedEvents);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  console.log("EVENTS \n ", events, "\n");
  return (
    <div className="weekly-calendar-container">
      <Calendar
        localizer={localizer}
        defaultView="week" // Specify the default view
        startAccessor="start"
        endAccessor="end"
        min={new Date().setHours(startingHour, 0, 0, 0)} //setta la prima ora visualizzata nel calendario
        style={{ height: 600, width: 1000 }}
        events={events}
        formats={{
          timeGutterFormat,
        }}
        messages={messages}
        components={{
          eventWrapper: EventDisplay,
        }}
      />
    </div>
  );
};

export default WeeklyCalendar;
