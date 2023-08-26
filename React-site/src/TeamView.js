import "./css/App.css";
import "./css/Homepage.css";

import NavBar from "./components/NavBar";
import TopBar from "./components/TopBar";
import WeeklyCalendar from "./components/WeeklyCalendar.js";
import Alert from "./components/Alert.tsx";
import { Container } from "./css/Navigator.css";
import { Accordion, Col, Row } from "react-bootstrap";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link, useNavigate, Navigate } from "react-router-dom";
import UserIcon from "./components/UserIcon";
import Notifications from "./components/Notifications";
import WebSocketComponent from "./components/WebSocketComponent";
import Task from "./components/Task.js";
import PopUp from "./components/PopUp.js";

var endpoint = "http://localhost:5000/teamGivenID";

function TeamView() {
  const inviteOk = sessionStorage.getItem("invite_alert") === "true";
  const handleInviteOk = () => {
    sessionStorage.setItem("invite_alert", "false");
  };
  const missingFields = sessionStorage.getItem("fields_alert") === "true";
  const handleMissingFields = () => {
    sessionStorage.setItem("fields_alert", "false");
  };
  const inviteKo = sessionStorage.getItem("inviteError_alert") === "true";
  const handleInviteKo = () => {
    sessionStorage.setItem("inviteError_alert", "false");
  };

  const [data, setData] = useState([]);
  const [new_member, setNewMember] = useState("");
  const queryParameters = new URLSearchParams(window.location.search);
  const id = queryParameters.get("id");
  const endpoint1 = "http://localhost:5000/teamDetails";
  const endpoint2 = "http://localhost:5000/invite";
  const decryptedUsername = localStorage.getItem("username");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [task, setTask] = useState([]);
  const showDeletePopUp = localStorage.getItem("delete") === "true";
  const task_id = localStorage.getItem("task_to_delete");
  const updateDimensions = () => {
    setWindowWidth(window.innerWidth);
  };
  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  useEffect(() => {
    axios
      .get(endpoint1, {
        params: {
          id: id,
        },
      })
      .then((response) => {
        if (response.data[0].description == "")
          response.data[0].description = "This team has no description"; //changing the field description
        setData(response.data);
        setIsAdmin(response.data[0].admins.includes(decryptedUsername))
      })
      .catch((error) => console.log(error));
  }, [isAdmin]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleInviteOk();
      handleInviteKo();
      handleMissingFields();
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Set form values
    localStorage.setItem("new_member", new_member);
    const username = new_member;
    const admin = localStorage.getItem("LoggedUser");

    if (new_member !== "") {
      try {
        // Send a POST request to the endpoint of the Flask server
        const response = await axios
          .post(endpoint2, {
            username,
            admin,
            id,
          })
          .catch(function (error) {
            if (error.response) {
              // Print error data
              console.log("Data: " + error.response.data);
              console.log("Status: " + error.response.status);
              console.log("Headers: " + error.response.headers);

              // Handle error
              if (error.response.status === 400) {
                sessionStorage.setItem("inviteError_alert", "true");
                window.location.replace(window.location.href); // For alert purposes only
              }
            }
          });

        // If the login has been successfully performed, then redirect the user to the homepage.
        if (response.status === 200) {
          sessionStorage.setItem("invite_alert", "true");
          window.location.replace(window.location.href); // For alert purposes only
        }
      } catch (error) {
        // Request failed
        console.log("[ERROR] Request failed: " + error);
      }
    } else {
      // There is at least one mandatory field that has not been filled
      sessionStorage.setItem("fields_alert", "true");
      window.location.replace(window.location.href); // For alert purposes only
      console.log("Username field must be filled to invite!");
    }
  };

  //in this way i pass some parameters to the destination page
  const handleNewEvent = () => {
    navigate("/home/newtask", {
      state: {
        event: data[0].admins,
        previousPage: window.location.pathname,
        team: id,
      },
    });
  };

  const handleNewTask = () => {
    navigate("/home/newtask", {
      state: {
        previousPage: window.location.pathname,
        team: id,
      },
    });
  };

  const handleSelectEvent = useCallback((event) => {
    setTask(event);
    console.log(event);
  });

  return (
    <div className="App">
      {/* <WebSocketComponent></WebSocketComponent> */}
      <div className="TopBar">
        <div className="BarHeading">
          <Link to="/" style={{ color: "inherit", textDecoration: "inherit" }}>
            Teamify
          </Link>
        </div>
        <div className="MenuOptions">
          <TopBar></TopBar>
        </div>
        <div className="Buttons">
          <Notifications></Notifications>
          <UserIcon></UserIcon>
        </div>
      </div>

      <div className="SideContainer overflow-auto">
        <NavBar></NavBar>
        <div className="container">
          <div className="mt-5">
            {inviteOk && (
              <Alert onClick={handleInviteOk} state="success">
                User invited succesfully
              </Alert>
            )}
            {inviteKo && (
              <Alert onClick={handleInviteKo} state="danger">
                This user doesn't exist or is already invited
              </Alert>
            )}
            {missingFields && (
              <Alert onClick={handleMissingFields} state="danger">
                Username field must be filled to invite!
              </Alert>
            )}
          </div>
          {task.id !== undefined && <Task task={task} />}
          {showDeletePopUp && <PopUp type="task" task_id={task_id} />}
          <div className="mb-5 mt-5">
            <h1>{data.map((item) => item.teamName)}</h1>
          </div>
          <div className="container" style={{ height: "80%" }}>
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header>Agenda</Accordion.Header>
                <Accordion.Body>
                  <Row>
                    <Col>
                      <div className="container d-flex justify-content-center mt-3">
                        <WeeklyCalendar
                          width={(windowWidth * 60) / 100}
                          height={570}
                          handleSelectEvent={handleSelectEvent}
                        />
                      </div>
                    </Col>
                    <Col style={{ marginLeft: "60px" }}>
                      <Row style={{ marginTop: "200px" }}>
                        <button
                          onClick={handleNewTask}
                          className="btn"
                          style={{
                            textDecoration: "inherit",
                            backgroundColor: "#c5fdc8",
                            width: "100px",
                          }}
                        >
                          New Task
                        </button>
                      </Row>
                      <Row></Row>
                      <Row className="mt-3">
                        <button
                          onClick={handleNewEvent}
                          className="btn"
                          style={{
                            textDecoration: "inherit",
                            backgroundColor: "#c5fdc8",
                            width: "100px",
                            cursor: isButtonDisabled
                              ? "not-allowed"
                              : "pointer",
                          }}
                        >
                          New Event
                        </button>
                      </Row>
                    </Col>
                  </Row>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>Team Info</Accordion.Header>
                <Accordion.Body>
                  {data.map((item) => (
                    <div>
                      <p>{item.description}</p>
                    </div>
                  ))}
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>Members</Accordion.Header>
                <Accordion.Body>
                  <div className="container">
                    {data.map((item) => (
                      <div className="row">
                        <div className="col-2">Team Members:</div>
                        {item.members.map((member, index) => (
                          <div className="col-1" key={member}>
                            {member}
                          </div>
                        ))}
                      </div>
                    ))}

                    {data.map((item) => (
                      <div className="row">
                        <div className="col-2">Team Admins:</div>
                        {item.admins.map((admin, index) => (
                          <div className="col-1" key={admin}>
                            {admin}
                          </div>
                        ))}
                      </div>
                    ))}
                    {isAdmin && (
                      <form onSubmit={handleSubmit}>
                        <div className="row">
                          <div className="col-10">
                            <div className="InputEntry">
                              <div className="InputLabel">
                                Invite a new member{" "}
                              </div>

                              <input
                                className="InputField"
                                type="string"
                                id="member_field"
                                placeholder="Insert the username"
                                onChange={(event) =>
                                  setNewMember(event.target.value)
                                }
                              ></input>
                            </div>
                          </div>
                          <div className="col-2" style={{ marginTop: 35 }}>
                            <input
                              className="personalized-button mt-3"
                              type="submit"
                              value={"Add"}
                              id="NewMember"
                            ></input>
                          </div>
                        </div>
                      </form>
                    )}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="3">
                <Accordion.Header>Surveys</Accordion.Header>
                <Accordion.Body></Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeamView;
