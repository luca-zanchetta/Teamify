import "./css/App.css";
import "./css/Homepage.css";

import NavBar from "./components/NavBar";
import TopBar from "./components/TopBar";
import WeeklyCalendar from "./components/WeeklyCalendar.js";
import Alert from "./components/Alert.tsx";
import { Container } from "./css/Navigator.css";
import Accordion from "react-bootstrap/Accordion";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserIcon from "./components/UserIcon";
import axios from "axios";

var endpoint = "http://localhost:5000/teamGivenID";

function TeamView() {
  const [new_member, setNewMember] = useState("");
  const [teamName, setTeamName] = useState("");
  const username = localStorage.getItem("LoggedUser");
  const currentURL = window.location.search;

  const params = new URLSearchParams(currentURL);
  const teamID = params.get('id');

  const handleSubmit = () => {
    console.log("new_member");
  };

  useEffect(() => {
    axios
      .get(endpoint, {
        params: {
          id:teamID,
        },
      }) // Pass the user parameter in the query string
      .then((response) => {
        setTeamName(response.data['name']);
      })
      .catch((error) => {
        console.error("Error fetching team data:", error);
      });
  }, []);

  // fetch(currentURL)
  //   .then(response => {
  //     if(!response.ok) {
  //       throw new Error('Request error: ${response.status}');
  //     }
  //     return response.json();
  //   })
  //   .then(data => {
  //     console.log(data);
  //   })
  //   .catch(error => {
  //     console.error('ERROR: ', error);
  //   });

  return (
    <div className="App">
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
          <UserIcon></UserIcon>
        </div>
      </div>

      <div className="SideContainer">
        <NavBar></NavBar>
        <div className="container">
          <div className="mb-5 mt-5">
            <h1>{teamName}</h1>
          </div>
          <div className="container  overflow-auto" style={{ height: "80%" }}>
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header>Agenda</Accordion.Header>
                <Accordion.Body>
                  <div className="container d-flex justify-content-center mt-3">
                    <WeeklyCalendar width={1000} height={570} />
                  </div>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>Team Info</Accordion.Header>
                <Accordion.Body></Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>Members</Accordion.Header>
                <Accordion.Body>
                  <div className="container">
                    <div className="row">
                      Actual Members: Here the list miss the connection with the
                      beckend
                    </div>
                    <div className="row">
                      <div className="col">
                        <form onSubmit={handleSubmit}>
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
                        </form>
                      </div>
                      <div className="col" style={{ marginTop: 35 }}>
                        <input
                          className="personalized-button mt-3"
                          type="submit"
                          value={"Add"}
                          id="NewMember"
                        ></input>
                      </div>
                    </div>
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
