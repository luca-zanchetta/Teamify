import "../css/App.css";
import "../css/Navigator.css";
import "../css/Login.css";
import "../css/Calendar.css";

import TopBar from "./TopBar.js";
import NavBar from "./NavBar.js";
import UserIcon from "./UserIcon.js";
import Alert from "./Alert.tsx";
import WeeklyCalendar from "./WeeklyCalendar.js";
import React, { useState, useCallback, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import moment from "moment";

var endpoint = "http://localhost:5000/home/newtask";

function EditTask() {
  const location = useLocation();
  const task = location.state.task;
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [date, setDate] = useState(task.date);
  const [time, setTime] = useState(new Date());
  const [duration, setDuration] = useState("");
  const [selectedSlots, setSelectedSlots] = useState([]);
  const navigate = useNavigate();

  const problem = sessionStorage.getItem("error_alert") === "true";
  const [error, setError] = useState("");

  const handleClosure = () => {
    sessionStorage.setItem("error_alert", false);
  };

  //for the modification mooolto da rivedere
  const handleUpdateTask = async (taskId) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/home/updatetask/${
          task.id
        }/${localStorage.getItem("LoggedUser")}`,
        title,
        description,
        date,
        time,
        duration //parameters to pass
      );
      console.log(response.data.message); // Display the response message
    } catch (error) {
      console.error("Error:", error);
    }
  };

  function convertDateToInputFormat(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const handleSelectSlot = useCallback((slotInfo) => {
    const dateTimeStart = new Date(slotInfo.slots[0]); //take start data
    const date_start = convertDateToInputFormat(dateTimeStart.toDateString());
    const time = dateTimeStart.toLocaleTimeString();
    const duration = (slotInfo.slots.length - 1) * 30; //get duration

    //get objects related to data, time and duration and change the value inside them
    const date_input = document.getElementById("date");
    const time_input = document.getElementById("time");
    const duration_input = document.getElementById("duration");
    date_input.value = date_start;
    setDate(date_start);
    time_input.value = time;
    setTime(time);
    duration_input.value = duration;
    setDuration(duration);
    slotInfo.slots.pop();
    setSelectedSlots(slotInfo.slots);
  });

  //function to handle the change of style when you select a slot
  //da debbugare
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userFromLocal = localStorage.getItem("LoggedUser");

    if (userFromLocal == "") {
      navigate("/login");
      alert("Not auth");
    }

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
  };

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
          <div className="container">
            <div className="row">
              <div className="col-sm">
                <div className="CardL">
                  <div className="CardHeading">Create new task</div>
                  <form onSubmit={handleSubmit}>
                    <div className="InputEntry">
                      <div className="InputLabel">Title</div>
                      <input
                        className="InputField"
                        type="text"
                        placeholder={title}
                        id="task"
                        onChange={(event) => setTitle(event.target.value)}
                      ></input>
                    </div>
                    <div className="InputEntry">
                      <div className="InputLabel">Description</div>
                      <input
                        className="InputField"
                        type="text"
                        placeholder="Enter a description if you want"
                        id="description"
                        onChange={(event) => setDescription(event.target.value)}
                      ></input>
                    </div>
                    <div className="InputEntry">
                      <div className="InputLabel">Date</div>
                      <input
                        className="InputField"
                        type="date"
                        placeholder="dd/mm/yyy"
                        id="date"
                        onChange={(event) => setDate(event.target.value)}
                      ></input>
                    </div>
                    <div className="InputEntry">
                      <div className="InputLabel">Time</div>
                      <input
                        className="InputField"
                        type="time"
                        id="time"
                        onChange={(event) => setTime(event.target.value)}
                      ></input>
                    </div>
                    <div className="InputEntry">
                      <div className="InputLabel">Duration (minutes)</div>
                      <input
                        className="InputField"
                        type="integer"
                        id="duration"
                        onChange={(event) => setDuration(event.target.value)}
                      ></input>
                    </div>
                    <input
                      className="personalized-button mt-3"
                      type="submit"
                      value={"NewTask"}
                      id="NewTask"
                    ></input>
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

export default EditTask;
