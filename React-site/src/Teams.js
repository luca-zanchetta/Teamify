import React, { useEffect, useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import TopBar from "./components/TopBar";
import NavBar from "./components/NavBar";
import Alert from "./components/Alert.tsx";

import UserIcon from "./components/UserIcon";
import Notifications from "./components/Notifications";
import axios from "axios";

function Teams() {

  const teamCreated = localStorage.getItem("teamCreated_alert") === "true";
  const handleTeamCreated = () => {
    localStorage.setItem("teamCreated_alert", "false")
  };  

  const username = localStorage.getItem("LoggedUser");
  const navigate = useNavigate();
  const endpoint = "http://localhost:5000/home/teams";
  const [teams, setTeams] = useState([]);

  const ToggleDisplayAgenda = () => {
    localStorage.setItem("ProfileData", "false");
    navigate("/home");
  };

  const handleBack = () => {
    navigate("/home");
  };

  useEffect(() => {
    axios
      .get(endpoint, {
        params: {
          user: username,
        },
      }) // Pass the user parameter in the query string
      .then((response) => {
        const res = response.data;

        const formattedTeams = res.map((team) => ({
          title: team.name,
          description: team.description,
          role: team.role,
        }));
        setTeams(formattedTeams);
      })
      .catch((error) => {
        console.error("Error fetching team data:", error);
      });
  }, []);

  //dopo 5 secondi setto la variabile dell'avviso a false, per evitare che venga messa a false e poi l'avviso non compaia
  //a causa dal re-render dato dalla call di axios (fatta nell'altro useEffect)
  useEffect(() => {
    const timeout = setTimeout(() => {
      handleTeamCreated();
    }, 1000)

    return () => clearTimeout(timeout)

  }, [])


  return (
    <div className="App">
      {!username && <Navigate to="/login" />}
      <div className="TopBar">
        <div className="BarHeading">
          <Link
            to="/"
            style={{ color: "inherit", textDecoration: "inherit" }}
            onClick={ToggleDisplayAgenda}
          >
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
        {teamCreated && (
        <Alert onClick={handleTeamCreated} state="success">
          Team created
        </Alert>
      )}
          <div className="row mt-4 mb-2" style={{ textAlign: "left" }}>
            <div className="col">
              <h1>Teams</h1>
            </div>
            <div
              className="col mt-3"
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
          <div className="container" height="80%">
            <div className="row mt-5">
              <div className="col">
                <div style={{ fontSize: "28px", fontWeight: "bold" }}>Name</div>
              </div>
              <div className="col">
                <div style={{ fontSize: "28px", fontWeight: "bold" }}>
                  Description
                </div>
              </div>
              <div className="col">
                <div style={{ fontSize: "28px", fontWeight: "bold" }}>Role</div>
              </div>
              <hr
                style={{
                  border: "1.5px solid black",
                }}
              />
            </div>
            {teams.map((team, index) => (
              <div className="row mb-5" key={index}>
                <div className="col">
                  <div>{team.title}</div>
                </div>
                <div className="col">
                  <div>{team.description}</div>
                </div>
                <div className="col mb-3">
                  <div>{team.role}</div>
                </div>
                <hr />
              </div>
            ))}
          </div>
          <div className="mt-5 pb-5" style={{ textAlign: "right" }}>
            <Link
            to="/home/createteam"
            style={{ color: "inherit", textDecoration: "inherit" }}
            className="btn btn-light"
          >Create team</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Teams;
