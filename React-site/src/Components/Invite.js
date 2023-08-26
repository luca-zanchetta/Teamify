import {React, useEffect, useState} from "react";
import { Navigate, useLocation, useNavigate, Link } from "react-router-dom";
import TopBar from "./TopBar";
import UserIcon from "./UserIcon";
import Notifications from "./Notifications";
import Alert from "./Alert.tsx";
import placeholder from "../img/placeholder_profile.jpeg";
import "../css/Invite.css";

import axios from "axios";

var endpointAcceptTeam = "http://localhost:5000/acceptInvite";
var endpointRejectTeam = "http://localhost:5000/rejectInvite";

function Invite() {
  const username = localStorage.getItem("LoggedUser");
  const location = useLocation();
  const [admin, setAdmin] = useState("");
  const [team, setTeam] = useState("");
  const [event_title, setEventTitle] = useState("");
  const [description, setDescription] = useState("");
  const [teamId, setTeamId] = useState("");

  const navigate = useNavigate();

  const handleReject = () => {
    if(team) {
      console.log("team");
    }
    else if(event_title) {
      console.log("event title: TO DO");
    }
  };
  
  async function handleAcceptance() {
    if(team) {
      try {
        // Send a POST request to the corresponding endpoint of the Flask server
        const response = await axios
          .post(endpointAcceptTeam, {
            username,
            teamId,
          })
          .catch(function (error) {
            if (error.response) {
              // Print error data
              console.log("Data: " + error.response.data);
              console.log("Status: " + error.response.status);
              console.log("Headers: " + error.response.headers);
            }
          });
  
        if (response.data.status === 200) {
          alert('You are now part of team '+team+'!');
          navigate("/home");
        }
      } catch (error) {
        // Request failed
        console.log("[ERROR] Request failed: " + error);
      }
    }
    else if(event_title) {
      console.log("event title: TO DO");
    }
  };

  const ToggleDisplayAgenda = () => {
    localStorage.setItem("ProfileData", "false");
    navigate("home");
  };

  useEffect(() => {
    if (location.state) {
      if (location.state.description) {
        setDescription(location.state.description);
      }
      if (location.state.admin) {
        setAdmin(location.state.admin);
      }
      if (location.state.team) {
        setTeam(location.state.team);
      }
      if (location.state.id) {
        setTeamId(location.state.id);
      }
    }
  }, [location.state]);
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
      <div className="central-container">
        <div className="container text-center ">
          <div className="align-content-center text-center mt-5">
            <div className="row mt-5">
              <div className="rounded-circle overflow-hidden mt-5">
                <img
                  src={placeholder}
                  className="img-fluid border border-2"
                  style={{ borderRadius: "50%" }}
                  width="15%"
                  height="15%"
                />
              </div>
            </div>
            <div className="row text-center">
              <div
                className="mx auto mt-2 mb-1"
                style={{ fontSize: "27px", fontWeight: "bold" }}
              >
                {admin || "Someone"}
              </div>
            </div>
            <div className="row text-center">
              <div className="mx auto" style={{ fontSize: "20px" }}>
                invited you to join
              </div>
            </div>
          </div>
          <div className="align-content-center text-center">
            <div className="mt-3 invite-container">
              <div className="mt-2">{team || event_title}</div>
              <div className="mt-2">
                {description || "Here the description"}
              </div>
              <br />
              <div className="row text-center">
                <div className="col-md-2"></div>
                <div className="col-md-4">
                  <button
                    className="btn btn-outline-danger"
                    onClick={handleReject}
                  >
                    Reject
                  </button>
                </div>
                <div className="col-md-4">
                  <button
                    className="btn btn-outline-success"
                    onClick={handleAcceptance}
                  >
                    Accept{" "}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Invite;
