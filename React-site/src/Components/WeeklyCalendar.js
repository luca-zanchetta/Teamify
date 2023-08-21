import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  buildMessage,
} from "react";
import { Calendar, momentLocalizer, Slot } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import "../Css/Calendar.css";
import axios from "axios";

var endpoint1 = "http://localhost:5000/tasks";
var endpoint2 = "http://localhost:5000/teamview";

const localizer = momentLocalizer(moment);

const messages = {
  previous: "←",
  next: "→",
};

interface Props {
  width: integer;
  height: integer;
  handleSelectSlot: () => void;
  slotPropGetter: () => void;
}

const WeeklyCalendar = ({
  width,
  height,
  handleSelectSlot,
  slotPropGetter,
}: Props) => {
  const startingHour = 8;
  const timeGutterFormat = "H:mm";
  const [events, setEvents] = useState([]);
  const localUser = localStorage.getItem("LoggedUser");
  const localTeam = 0; //da gestire quando si implementano i team
  const currentPath = window.location.pathname; //get the current position

  const eventStyleGetter = (event, start, end, isSelected) => {
    const style = {
      backgroundColor: "#07fcaf",
      borderRadius: "10px",
      color: "black",
      border: "0px",
      display: "inline-block",
    };
    return {
      style: style,
    };
  };

  const handleSelectEvent = useCallback((event) => {
    alert(event.title);
  });

  const MyEvent = ({ event }) => <div>{event.title}</div>;

  const components = {
    agenda: {
      event: MyEvent, // Use your custom event component
    },
    event: MyEvent,
  };

  useEffect(() => {
    if (currentPath === "/home") {
      axios
        .get(endpoint1, {
          params: {
            user: localUser,
          },
        })
        .then((response) => {
          const tasks = response.data;

          const formattedEvents = tasks.map((task) => ({
            title: task.title,
            start: new Date(task.start),
            end: new Date(task.end),
          }));

          setEvents(formattedEvents);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } else {
      //If i'm not on the home and so i'm on the team view, i want to visualize my tasks and all the events created in the group
      axios
        .get(endpoint2, {
          params: {
            user: localUser,
            team: localTeam, //da gestire quando si implementano i team
          },
        })
        .then((response) => {
          const tasks = response.data;

          const formattedEvents = tasks.map((task) => ({
            title: task.title,
            start: new Date(task.start),
            end: new Date(task.end),
          }));

          setEvents(formattedEvents);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, []);

  return (
    <div className="weekly-calendar-container">
      <Calendar
        localizer={localizer}
        defaultView="week"
        startAccessor="start"
        endAccessor="end"
        min={new Date().setHours(startingHour, 0, 0, 0)}
        style={{ height: height, width: width }}
        events={events}
        formats={{
          timeGutterFormat,
        }}
        components={components}
        messages={messages}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
        onSelectSlot={handleSelectSlot}
        selectable
        slotPropGetter={slotPropGetter}
      />
    </div>
  );
};

export default WeeklyCalendar;
