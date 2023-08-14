import "./Css/App.css";
import "./Css/Navigator.css";
import "./Css/Login.css";

import TopBar from "./Components/TopBar.js";
import NavBar from "./Components/NavBar.js";
import UserIcon from "./Components/UserIcon.js";
import Alert from "./Components/Alert.tsx";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

var endpoint = "http://localhost:5000/newtask";

function NewTask() {
  const [id, setId] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState(new Date());
  const [user, setUser] = useState("");
  const [status, setStatus] = useState(false);
  const [type, setType] = useState("personal");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userFromLocal = localStorage.getItem("user");

    if (userFromLocal == "") {
      navigate("/login");
      alert("Not auth");
    }

    if (title !== "" && date !== "" && time !== "") {
      try {
        // Send a POST request to the /signup endpoint of the Flask server
        const response = await axios.post(endpoint, {
          title,
          date,
          time,
          description,
          user: userFromLocal,
        });
        // If the signup has been successfully performed, then redirect the user to the Login page.
        // Sarebbe più carino un avviso di successo o qualcosa di simile
        if (response.status === 200) {
          navigate("/home");
          sessionStorage.setItem("new_task", true);
        } else if (response.status === 400) {
          alert(
            "[ERROR] Something bad happened :(" //da modificare con l'alert
          );
        } else if (response.status === 401) {
          alert(
            "[ERROR] Something bad happened :(" //da modificare con l'alert
          );
        }
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          error.response &&
          error.response.status === 401
        ) {
          navigate("/login");
          console.log("Unauthorized: User not authenticated");
        }
      }
    } else {
      // There is at least one mandatory field that has not been filled
      alert("All the fields must be filled!"); //da modificare con l'alert component
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

        <div className="SignUpBackground">
          <div className="CardL">
            <div className="CardHeading">Create new task</div>
            <form onSubmit={handleSubmit}>
              <div className="InputEntry">
                <div className="InputLabel">Title</div>
                <input
                  className="InputField"
                  type="text"
                  placeholder="Enter a title for your task"
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
                  type="text"
                  id="time"
                  onChange={(event) => setTime(event.target.value)}
                ></input>
              </div>

              <input type="submit" value={"NewTask"} id="NewTask"></input>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewTask;
