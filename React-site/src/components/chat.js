import "../css/Navigator.css";

import { useEffect } from "react";

import "../css/chat.css";
import chat from "../icons/chat.png";
import cancel from "../icons/cancel.png";
import face from "../img/face.jpeg";
import { useState } from "react";
import { address, flask_port } from "./Endpoint";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const username = localStorage.getItem("LoggedUser");
var endpointGetTeamsFromUser = address + flask_port + "/getJoinedTeams";

function Chat() {
  const [show, setShow] = useState(false);
  const [teams, setTeams] = useState([]);
  const [showTeams, setShowTeams] = useState(false);
  const navigate = useNavigate();

  function ToggleChat() {
    setShow(!show);
  }

  function OnChatSubmit(e) {
    var code = e.keyCode ? e.keyCode : e.which;
    if (code == 13) {
      //Enter keycode
      e.preventDefault();
      var text = e.target.value;
      console.log("text sumbitted: " + text);
      e.target.value = "";
    }
  }
  function showChat() {}

  // Get teams of the user
  async function get_teams() {
    try {
      // Send a POST request to the corresponding endpoint of the Flask server
      const response = await axios
        .post(endpointGetTeamsFromUser, {
          username,
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
        setTeams(response.data.teams);
        setShowTeams(true);
      } else if (response.data.status === 201) {
        setTeams([]);
        setShowTeams(false);
      }
    } catch (error) {
      // Request failed
      console.log("[ERROR] Request failed: " + error);
    }
  }

  useEffect(() => {
    get_teams();
    showChat();
  }, []);

  return (
    <div className="Bubble">
      {(!show && (
        <>
          <img src={chat} onClick={ToggleChat}></img>
        </>
      )) ||
        (show && (
          <div className="ChatContainer">
            <div className="ChatTopBar">
              <select id="chosenTeam" style={{ marginLeft: 15, marginTop: 10 }}>
                {showTeams &&
                  teams.map((team, index) => (
                    <option value={index}>{team}</option>
                  ))}
              </select>
              {!showTeams && <h3>No team available</h3>}

              {/* <h3>
                            team 2
                            <i className="arrow up"></i>
                        </h3> */}
              <img src={cancel} onClick={ToggleChat}></img>
            </div>
            <hr></hr>
            <div className="ChatBody">
              <div className="hatEntry">
                <img src={face}></img>
                <div className="ChatEntryText">
                  <h2>Username</h2>
                  <h3>
                    Acuna matata a tutti ragazzi, ben ritrovati dal vostro
                    ciccio gamer 89!
                  </h3>
                </div>
              </div>
              <div className="ChatEntry">
                <img src={face}></img>
                <div className="ChatEntryText">
                  <h2>Username</h2>
                  <h3>siuummmm! forza juve</h3>
                  <h5>28/08 - 16:54</h5>
                </div>
              </div>
              <div className="ChatEntry">
                <img src={face}></img>
                <div className="ChatEntryText">
                  <h2>Username</h2>
                  <h3>siuummmm! forza juve</h3>
                  <h5>28/08 - 16:54</h5>
                </div>
              </div>
            </div>
            <hr></hr>
            <input type="text" onKeyDown={OnChatSubmit} id="chatInput"></input>
          </div>
        ))}
    </div>
  );
}

export default Chat;
