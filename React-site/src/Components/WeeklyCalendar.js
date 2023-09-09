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
import "../css/Calendar.css";
import axios from "axios";

import { address, flask_port } from "./Endpoint";

var endpoint1 = address + flask_port + "/tasks";
var endpoint2 = address + flask_port + "/teamview";

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
  handleSelectEvent: () => void;
}

const WeeklyCalendar = ({
  width,
  height,
  handleSelectSlot,
  slotPropGetter,
  handleSelectEvent,
}: Props) => {
  const startingHour = 8;
  const timeGutterFormat = "H:mm";
  const [events, setEvents] = useState([]);
  const localUser = localStorage.getItem("LoggedUser");
  const localTeam = 0; //da gestire quando si implementano i team
  const endpoint_event = address + flask_port + "/getColor";
  const currentPath = window.location.href; //get the current position
  const [colors, setColors] = useState({});

  useEffect(() => {
    const eventIds = events.map((event) => event.id).join(",");
    axios
      .get(endpoint_event, {
        params: {
          event: eventIds,
        },
      })
      .then((response) => {
        setColors(response.data);
      })
      .catch((error) => {
        console.error("Error fetching color:", error);
      });
  }, [events]);

  const eventStyleGetter = (event, start, end, isSelected) => {
    if (event.type === "personal") {
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
    } else {
      const style = {
        backgroundColor: colors[event.id],
        borderRadius: "10px",
        color: "black",
        border: "0px",
        display: "inline-block",
      };
      return {
        style: style,
      };
    }
  };

  const hSE = useCallback((event) => {
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
            id: task.id,
            title: task.title,
            start: new Date(task.start),
            end: new Date(task.end),
            description: task.description,
            status: task.status,
            type: task.type,
            duration: task.duration,
            member: task.member,
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
            id: task.id,
            title: task.title,
            start: new Date(task.start),
            end: new Date(task.end),
            description: task.description,
            status: task.status,
            type: task.type,
            duration: task.duration,
            member: task.member,
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
