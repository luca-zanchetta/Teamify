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
import Survey from "./components/Survey";
import "./css/Survey.css"
import { address, flask_port } from "./components/Endpoint";
import Chat from "./components/chat";

import CreateSurvey from "./components/CreateSurvey";


var endpoint = address + flask_port + "/teamGivenID";

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
  const endpoint1 = address + flask_port + "/teamDetails";
  const endpoint2 = address + flask_port + "/invite";
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
        setIsAdmin(response.data[0].admins.includes(decryptedUsername));
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
        event: data[0].members,
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

  const handleBack = () => {
    window.location.replace("/home/teams");
  };

  const handleLeaveTeam = async () => {
    try {
      const response = await axios.delete(
        address + flask_port + `/home/teams/leaveteam`,
        {
          data: null, // Send an empty data object to indicate no request body
          params: { teamId: id, username: decryptedUsername }, // Add params if needed
        }
      );
      if (response.status === 200) {
        // If the deletion was successful, update local storage and reload the page
        window.location.replace("/home/teams");
        // TODO: You can add an alert here to inform the user about the successful action
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle any errors that occur during the DELETE request
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        address + flask_port + `/home/teams/deleteteam`,
        {
          data: null, // Send an empty data object to indicate no request body
          params: { teamId: id }, // Add params if needed
        }
      );
      if (response.status === 200) {
        // If the deletion was successful, update local storage and reload the page
        window.location.replace("/home/teams");
        // TODO: You can add an alert here to inform the user about the successful action
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle any errors that occur during the DELETE request
    }
  };

  return (
    <div className="App">
      <Chat></Chat>
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
          <div className="row mt-4 mb-2" style={{ textAlign: "left" }}>
            <div className="row mb-3">
              <div className="col"></div>
              <div className="col"></div>
              <div className="col"></div>
              <div className="col"></div>
              <div className="col"></div>
              <div className="col"></div>
              <div className="col"></div>

              <div
                className="col"
                style={{
                  textAlign: "right",
                  cursor: "pointer",
                }}
                onClick={handleLeaveTeam}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  fill="currentColor"
                  classNAme="bi bi-box-arrow-left"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z"
                  />
                  <path
                    fill-rule="evenodd"
                    d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"
                  />
                </svg>
              </div>
              {isAdmin && (
                <div
                  className="col"
                  style={{ textAlign: "right", cursor: "pointer" }}
                  onClick={handleDelete}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    fill="currentColor"
                    class="bi bi-trash3"
                    viewBox="0 0 16 16"
                  >
                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                  </svg>
                </div>
              )}
              <div
                className="col"
                style={{ textAlign: "right", cursor: "pointer" }}
                onClick={handleBack}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  fill="currentColor"
                  className="bi bi-arrow-90deg-left"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.146 4.854a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H12.5A2.5 2.5 0 0 1 15 6.5v8a.5.5 0 0 1-1 0v-8A1.5 1.5 0 0 0 12.5 5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4z"
                  />
                </svg>
              </div>
            </div>
            <div className="row text-center">
              <h1>{data.map((item) => item.teamName)}</h1>
            </div>
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
                <Accordion.Body>
                  <CreateSurvey></CreateSurvey>
                  <hr></hr>
                  <div className="Surveys">
                    <Survey title="Esempio di titolo" description="Descrizione." votes="14" date="14/02/23" author="Prova prova" entries={[[ "50%" , "ciao", true], [ "25%" , "ciaociao", false], [ "25%" , "eheheh", false]]}>
                    </Survey>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeamView;
