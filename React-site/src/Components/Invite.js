import React from "react";
import { Navigate } from "react-router-dom";
import TopBar from "./TopBar";
import UserIcon from "./UserIcon";
import Notifications from "./Notifications";
import Alert from "./Alert.tsx";
import placeholder from "../img/placeholder_profile.jpeg";
import "../Css/Invite.css";

interface Props {
  description: string; //the message the user will see
  handleAcceptance: () => void;
  handleReject: () => void; //when you call Invite you can pass the handle function
  team?: string; //name of the team, question marks means optional
  admin: string; //the person that invite you
  event_title?: string;
}

function Invite({
  description,
  team,
  admin,
  event_title,
  handleAcceptance,
  handleReject,
}) {
  const username = localStorage.getItem("LoggedUser");
  return (
    <div className="App">
      {!username && <Navigate to="/login" />}
      <div className="TopBar">
        <div className="BarHeading">Teamify</div>
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
