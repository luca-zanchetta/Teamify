import "./css/App.css";
import "./css/Navigator.css";
import "./css/Login.css";
import "./css/Calendar.css";

import TopBar from "./components/TopBar.js";
import NavBar from "./components/NavBar.js";
import UserIcon from "./components/UserIcon.js";
import Alert from "./components/Alert.tsx";
import WeeklyCalendar from "./components/WeeklyCalendar.js";
import React, { useState, useCallback, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { formatTime, formatDate } from "./support.js";

const endpoint = "http://localhost:5000/home/newtask";

function NewTask() {
  const location = useLocation();
  const [modify, setModify] = useState(false);
  const [task, setTask] = useState([]);
  const [id, setId] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState(new Date());
  const [user, setUser] = useState("");
  const [status, setStatus] = useState(false);
  const [type, setType] = useState("personal");
  const [duration, setDuration] = useState("");
  const [selectedSlots, setSelectedSlots] = useState([]);

  const navigate = useNavigate();

  const problem = sessionStorage.getItem("error_alert") === "true";
  const [error, setError] = useState("");

  const handleClosure = () => {
    sessionStorage.setItem("error_alert", false);
  };

  const handleSelectSlot = useCallback((slotInfo) => {
    const date_start = formatDate(slotInfo.slots[0]);
    const time = formatTime(slotInfo.slots[0]);
    console.log(date_start, time);
    const duration = (slotInfo.slots.length - 1) * 30; //get duration

    //get objects related to data, time and duration and change the value inside them
    const date_input = document.getElementById("date");
    const time_input = document.getElementById("time");
    const duration_input = document.getElementById("duration");
    date_input.value = date_start;
    time_input.value = time;
    duration_input.value = duration;

    setDate(date_start);
    setTime(time);
    setDuration(duration);

    slotInfo.slots.pop();
    setSelectedSlots(slotInfo.slots);
  });

  //function to handle the change of style when you select a slot
  // FIXME: da debbugare
  const slotStyleGetter = useCallback(
    (date) => {
      const isDateSelected = selectedSlots.some(
        (selectedDate) =>
          moment(selectedDate).isSame(date, "day") &&
          moment(selectedDate).isSame(date, "hour") &&
          moment(selectedDate).isSame(date, "minute")
      );

      const className = isDateSelected ? "selected-slot" : "";
      //class to apply if the slot is selected

      return {
        className: className,
      };
    },

    [selectedSlots]
  );

  //handle the highlit of the slot once you selected it
  //to create a task
  const handleSubmit = async (event) => {
    event.preventDefault();

    const userFromLocal = localStorage.getItem("LoggedUser");

    if (userFromLocal == "") {
      navigate("/login");
      alert("Not auth");
    }

    const buttonId = event.nativeEvent.submitter.id;
    if (buttonId == "NewTask") {
      console.log("new");
      if (title !== "" && date !== "" && time !== "") {
        try {
          // Send a POST request to the /newtask endpoint of the Flask server
          const response = await axios.post(endpoint, {
            title,
            date,
            time,
            description,
            user: userFromLocal,
            duration,
          });
          // If task has been successfully created, then redirect the user to the Home page.
          console.log(response.status);
          if (response.status === 200) {
            navigate("/home");
            sessionStorage.setItem("new_task", true);
          } else {
            console.log("error");
            sessionStorage.setItem("error_alert", true);
            setError("Something dab happened");
          }
        } catch (error) {
          if (
            axios.isAxiosError(error) &&
            error.response &&
            error.response.status === 401
          ) {
            navigate("/login");
            console.log("Unauthorized: User not authenticated");
          } else {
            // There is at least one mandatory field that has not been filled
            console.log("ERROR FROM NEW TASK", error);
            sessionStorage.setItem("error_alert", true);
            setError(
              "All the fields must be filled and must must respect the type constraints"
            );
          }
        }
      } else {
        sessionStorage.setItem("error_alert", true);
        console.log(
          "ERROR FROM NEW TASK date:",
          date,
          "time",
          time,
          "title:",
          title
        );
        setError(
          "All the fields must be filled and must must respect the type constraints"
        );
      }
    } else if (buttonId == "Edit") {
      console.log("edit");
      try {
        const response = await axios.put(
          `http://localhost:5000/home/updatetask/${
            task.id
          }/${localStorage.getItem("LoggedUser")}`,
          {
            title: title,
            description: description,
            date: date,
            time: time,
            duration: duration, //parameters to pass
          }
        );
        if (response.status == 200) {
          navigate("/home");
          // TODO: add alert
        }
        console.log(response.data.message); // Display the response message
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleBack = () => {
    navigate("/home");
  };

  //check if i'm going to modify the task and so i passed it or not
  useEffect(() => {
    if (location.state && location.state.task) {
      const t = location.state.task;
      setTask(t);
      setTime(formatTime(t.start));
      setDate(formatDate(t.start));
      setTitle(t.title);
      setDescription(t.description);
      setDuration(t.duration);
      setModify(true);
    } else {
      setModify(false);
    }
  }, [location.state]);
  return (
    <div>
      <div className="App">
        <div className="TopBar">
          <div className="BarHeading">
            <Link
              to="/"
              style={{ color: "inherit", textDecoration: "inherit" }}
            >
              Teamify
            </Link>
          </div>
          <div className="MenuOptions">
            <TopBar></TopBar>
          </div>
          <div className="Buttons">
            <UserIcon></UserIcon>
          </div>
        </div>
        {error && (
          <Alert onClick={handleClosure} state="danger">
            {error}
          </Alert>
        )}

        <div className="SignUpBackground">
          <div className="container" style={{ Display: "flex" }}>
            <div className="row mb-5">
              <div
                style={{ textAlign: "right", cursor: "pointer" }}
                onClick={handleBack}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  fill="currentColor"
                  class="bi bi-arrow-90deg-left"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M1.146 4.854a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H12.5A2.5 2.5 0 0 1 15 6.5v8a.5.5 0 0 1-1 0v-8A1.5 1.5 0 0 0 12.5 5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4z"
                  />
                </svg>
              </div>
            </div>
            <div className="row" style={{ Display: "flex" }}>
              <div className="col-sm">
                <div className="CardL">
                  <div className="CardHeading">
                    {(modify && "Modify task") || "Create new task"}
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="InputEntry">
                      <div className="InputLabel">Title</div>
                      <input
                        className="InputField"
                        type="text"
                        placeholder={
                          (modify && task.title) || "Enter a new title"
                        }
                        id="task"
                        onChange={(event) => setTitle(event.target.value)}
                      ></input>
                    </div>
                    <div className="InputEntry">
                      <div className="InputLabel">Description</div>
                      <input
                        className="InputField"
                        type="text"
                        placeholder={
                          (modify && task.description) ||
                          "Enter a description if you want"
                        }
                        id="description"
                        onChange={(event) => setDescription(event.target.value)}
                      ></input>
                    </div>
                    <div className="InputEntry">
                      <div className="InputLabel">Date</div>
                      <input
                        className="InputField"
                        type="date"
                        value={date ? date : formatDate(new Date())} // Use the current date
                        id="date"
                        onChange={(event) => setDate(event.target.value)}
                      />
                    </div>
                    <div className="InputEntry">
                      <div className="InputLabel">Time</div>
                      <input
                        className="InputField"
                        type="time"
                        id="time"
                        value={time ? time : "10:00"}
                        onChange={(event) => setTime(event.target.value)}
                      ></input>
                    </div>
                    <div className="InputEntry">
                      <div className="InputLabel">Duration (minutes)</div>
                      <input
                        className="InputField"
                        type="number"
                        id="duration"
                        placeholder={(modify && task.duration) || "0"}
                        value={duration}
                        onChange={(event) => setDuration(event.target.value)}
                      ></input>
                    </div>
                    {(!modify && (
                      <input
                        className="personalized-button mt-3"
                        type="submit"
                        value={"NewTask"}
                        id="NewTask"
                      ></input>
                    )) || (
                      <input
                        className="personalized-button mt-3"
                        type="submit"
                        value={"Edit"}
                        id="Edit"
                      ></input>
                    )}
                  </form>
                </div>
              </div>
              <div className="col">
                <div className="CardL">
                  <WeeklyCalendar
                    height={470}
                    width={800}
                    handleSelectSlot={handleSelectSlot}
                    slotPropGetter={slotStyleGetter}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewTask;
