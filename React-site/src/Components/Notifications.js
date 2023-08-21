import "../css/Navigator.css";

import { Link } from "react-router-dom";
import bell from "../icons/bell.png";
import team from "../icons/team.png";
import event from "../icons/event.png";

import { useState } from "react";

function Notifications() {
  const [show, setShow] = useState(false);
  function toggleShow() {
    setShow(!show);
  }

  return (
    <div className="UserIcon" style={{ paddingRight: "10%" }}>
      <img src={bell} onClick={toggleShow}></img>
      {show && (
        <>
          <div id="NotificationDrop">
            <div className="NotificationEntry">
              <div className="NotificationIcon">
                <img src={team}></img>
              </div>
              <div className="NotificatioTitles">
                <h3>Team A</h3>
                <h4>Tizio has added caio to your team!</h4>
              </div>
            </div>
            <div className="NotificationEntry">
              <div className="NotificationIcon">
                <img src={event}></img>
              </div>
              <div className="NotificatioTitles">
                <h3>Team C</h3>
                <h4>Tizio created a new event!</h4>
              </div>
            </div>
            <div className="NotificationEntry">
              <div className="NotificationIcon">
                <img src={event}></img>
              </div>
              <div className="NotificatioTitles">
                <h3>Team C</h3>
                <h4>Tizio created a new event!</h4>
              </div>
            </div>
            <div className="NotificationEntry">
              <div className="NotificationIcon">
                <img src={event}></img>
              </div>
              <div className="NotificatioTitles">
                <h3>Team C</h3>
                <h4>Tizio created a new event!</h4>
              </div>
            </div>
            <div className="NotificationEntry">
              <div className="NotificationIcon">
                <img src={event}></img>
              </div>
              <div className="NotificatioTitles">
                <h3>Team C</h3>
                <h4>Tizio created a new event!</h4>
              </div>
            </div>
            <div className="NotificationEntry">
              <div className="NotificationIcon">
                <img src={event}></img>
              </div>
              <div className="NotificatioTitles">
                <h3>Team C</h3>
                <h4>Tizio created a new event!</h4>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Notifications;
