import { useNavigate, useLocation } from "react-router-dom";
import "../css/task.css";
import { handleRevert } from "./Profile";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { formatTime } from "../support.js";

interface Props {
  task: Object;
}
function Task({ task }: Props) {
  const endpoint = "http://localhost:5000/home/members/";
  const username = localStorage.getItem("LoggedUser");
  const navigate = useNavigate();
  const [updatedTask, setUpdatedTask] = useState([]);
  const [members, setMembers] = useState([]);
  const formattedTime = formatTime(task.end);

  const [isExpanded, setIsExpanded] = useState(false);
  const toggleAccordion = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDelete = () => {};

  const handleComplete = () => {
    try {
      const response = axios.put(
        `http://localhost:5000/home/completetask/${task.id}`
      );
      console.log(response.data.message); // Display the response message
    } catch (error) {
      console.error("Error:", error);
    }
  };

  //in this way you can pass the props through the navigate
  const handleEdit = () => {
    navigate("/home/tasks/edittask", { state: { task: task } });
  };

  useEffect(() => {
    if (task.type === "event") {
      axios
        .get(endpoint, {
          params: {
            user: username,
          },
        }) // Pass the user parameter in the query string
        .then((response) => {
          //const res = response.data;
          //const formattedTeams = res.map((team) => ({
          // title: team.name,
          //description: team.description,
          //members: team.members,
          //}));
          //setTeams(formattedTeams);
        })
        .catch((error) => {
          console.error("Error fetching team data:", error);
        });
    }
  });

  //bisogna cambiare i pulsanti e metterli cliccabili solo se admin
  return (
    <div className="MessageContainer" id="message-container">
      <div className="CardPopUP">
        <div className="row">
          <h6 style={{ textAlign: "center" }}>{task.title}</h6>
          <hr />
        </div>
        <div className="row">
          <p>
            {task.start.toLocaleString()} - {formattedTime}
          </p>
        </div>
        <div className="row">
          <p>
            <b>Description: </b> {task.description}
          </p>
        </div>
        {task.type === "event" && (
          <div className="accordion">
            <div className="accordion-header" onClick={toggleAccordion}>
              <button class="btn btn-light" type="button">
                Group Members{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-caret-down"
                  viewBox="0 0 16 16"
                >
                  <path d="M3.204 5h9.592L8 10.481 3.204 5zm-.753.659 4.796 5.48a1 1 0 0 0 1.506 0l4.796-5.48c.566-.647.106-1.659-.753-1.659H3.204a1 1 0 0 0-.753 1.659z" />
                </svg>
              </button>
            </div>
            {isExpanded && (
              <div className="accordion-content">
                <ul>
                  {members.map((member, index) => (
                    <li key={index}>{member}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="container">
          <div className="row mt-2">
            <div className="col">
              <button
                className="btn btn-block"
                style={{
                  border: "solid #c5fdc8",
                  color: "black",
                  width: "100%",
                }}
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
            <div className="col">
              <button
                className="btn btn-block"
                style={{
                  border: "solid #c5fdc8",
                  color: "black",
                  width: "100%",
                }}
                onClick={handleEdit}
              >
                Edit
              </button>
            </div>
            {(task.status === "not_completed" && (
              <div className="col">
                <button
                  className="btn btn-block"
                  style={{
                    border: "solid #c5fdc8",
                    color: "black",
                    width: "100%",
                  }}
                  onClick={handleComplete}
                >
                  Complete
                </button>
              </div>
            )) || (
              <div className="col">
                <button
                  className="btn btn-block"
                  style={{
                    border: "solid #c5fdc8",
                    color: "black",
                    width: "100%",
                  }}
                  onClick={handleComplete}
                >
                  Restore
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Task;
