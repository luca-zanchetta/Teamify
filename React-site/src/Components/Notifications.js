import "../css/Navigator.css";

import bell from "../icons/bell.png";
import team from "../icons/team.png";
import event from "../icons/event.png";
import alarm from "../icons/alarm.png";

import { Link, useNavigate, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import Invite from "./Invite";

var endpoint = "http://localhost:5000/home/notifications";
var endpointReadNotification = "http://localhost:5000/readNotification";
var endpointCheckInvites = "http://localhost:5000/checkInvites";

function Notifications() {
  const [show, setShow] = useState(false);
  const username = localStorage.getItem("LoggedUser");
  const [notifications, setNotifications] = useState([]);
  const [displayNotifications, setDisplayNotifications] = useState(true);
  const [notification_id, setNotificationId] = useState(0);
  const [invites, setInvites] = useState([]);
  const [admin, setAdmin] = useState("");
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");

  const navigate = useNavigate();

  // Show user notifications
  const show_notifications = async (event) => {
    try {
      // Send a POST request to the corresponding endpoint of the Flask server
      const response = await axios
        .post(endpoint, {
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
        setNotifications(response.data.notifications);
        setDisplayNotifications(true);
      } else if (response.data.status === 201) {
        setDisplayNotifications(false);
      }
    } catch (error) {
      // Request failed
      console.log("[ERROR] Request failed: " + error);
    }
  };

  // The following function will be executed only one time at the beginning of the building of the page
  useEffect(() => {
    show_notifications();
    for(let i = 0; i < notifications.length; i++) {
      if(notifications[i][4] === false) {
        var bellIcon = document.getElementById('bell');
        bellIcon.src = alarm;
      }
    }
  }, []);

  function toggleShow() {
    setShow(!show);
    show_notifications();

    for(let i = 0; i < notifications.length; i++) {
      if(notifications[i][4] === false) {
        var bellIcon = document.getElementById('bell');
        bellIcon.src = alarm;
      }
    }
  }

  // Handle user notifications
  async function handleNotification(notification) {
    // Handlers for the notification types, only if it is the first time I am reading the notification
    if(notification[4] === false) {
      switch(notification[3]) {
        case 'invite':
          try {
            // Send a POST request to the corresponding endpoint of the Flask server
            const response = await axios
              .post(endpointCheckInvites, {
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
              navigate("/invite", { state: { description: response.data.invites[0].team_description, admin:response.data.invites[0].admin, team:response.data.invites[0].team_name, id:response.data.invites[0].id } });
            }
          } catch (error) {
            // Request failed
            console.log("[ERROR] Request failed: " + error);
          }
          break;
        
        case 'message':
          break;

        case 'survey':
          break;

        case 'event':
          break;

        case 'admin':
          break;
        
        default:
          console.log('The notification has been read!');
      }

      // If I click on a non-read notification, I'm reading it
      // try {
      //   // Send a POST request to the corresponding endpoint of the Flask server
      //   const response = await axios
      //     .post(endpointReadNotification, {
      //       notification_id,
      //     })
      //     .catch(function (error) {
      //       if (error.response) {
      //         // Print error data
      //         console.log("Data: " + error.response.data);
      //         console.log("Status: " + error.response.status);
      //         console.log("Headers: " + error.response.headers);
      //       }
      //     });
  
      //   if (response.data.status === 200) {
      //     console.log('Notification read!');
      //   }
      // } catch (error) {
      //   // Request failed
      //   console.log("[ERROR] Request failed: " + error);
      // }
    }
  };

  return (
    <div className="UserIcon" style={{ paddingRight: "1%", marginRight: "2%" }}>
      <img src={bell} onClick={toggleShow} id='bell'></img>
      {show && (
        <>
          <div id="NotificationDrop">
            {displayNotifications && notifications.map((notification, index) => (
              <div key={index} className="NotificationEntry" style={{ width: "100%" }} onClick={() => handleNotification(notification)}>
              <div className="NotificationIcon">
                <img src={event} alt="Event Icon" />
              </div>
              <div className="NotificatioTitles">
                <h3>{notification[3]}</h3>
                <h4>{notification[2]}</h4>
                <h4>{notification[1]}</h4>
              </div>
            </div>
            ))}
            {!displayNotifications && (
              <div className="NotificationEntry" style={{ width: "100%" }}>
                <div className="NotificationIcon">
                  <img src={event} alt="Event Icon" />
                </div>
                <div className="NotificatioTitles">
                  <h3>No notification available!</h3>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Notifications;
