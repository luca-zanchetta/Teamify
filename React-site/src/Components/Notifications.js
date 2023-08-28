import "../css/Navigator.css";

import bell from "../icons/bell.png";
import event from "../icons/event.png";
import alarm from "../icons/alarm.png";

import { Link, useNavigate, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import { address, flask_port } from "./Endpoint";

var endpoint = address+flask_port+"/home/notifications";
var endpointReadNotification = address+flask_port+"/readNotification";
var endpointCheckInvites = address+flask_port+"/checkInvites";

function Notifications() {
  const [show, setShow] = useState(false);
  const username = localStorage.getItem("LoggedUser");
  const [notifications, setNotifications] = useState([]);
  const [displayNotifications, setDisplayNotifications] = useState(true);
  const [notification_id, setNotificationId] = useState(0);

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
        for(let i = 0; i < response.data.notifications.length; i++) {
          if(response.data.notifications[i][4] === false) {
            var bellIcon = document.getElementById('bell');
            bellIcon.src = alarm;
          }
        }
      } else if (response.data.status === 201) {
        setDisplayNotifications(false);
      }
    } catch (error) {
      // Request failed
      console.log("[ERROR] Request failed: " + error);
    }
  };

  async function read_notification(notification_id) {
    // If I click on a non-read notification, I'm reading it
    try {
      // Send a POST request to the corresponding endpoint of the Flask server
      const response_2 = await axios.post("http://localhost:5000/readNotification", {
        notification_id,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
        
        if (response_2 && response_2.data && response_2.data.status === 200) {
          console.log('Notification read!');
        } else {
          console.log('Invalid response:', response_2);
        }
    } catch (error) {
      // Request failed
      console.log("[ERROR] Request failed: " + error);
    }
  }

  // The following function will be executed only one time at the beginning of the building of the page
  useEffect(() => {
    show_notifications();
  }, []);

  function toggleShow() {
    setShow(!show);
    show_notifications();

    var bellIcon = document.getElementById('bell');
    bellIcon.src = bell;

    for(let i = 0; i < notifications.length; i++) {
      if(notifications[i][4] === false) {
        var bellIcon = document.getElementById('bell');
        bellIcon.src = alarm;
      }
    }
  }

  // Handle user notifications
  async function handleNotification(notification) {
    // Handlers for the notification types
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
            read_notification(notification[0]);
            navigate("/invite", { state: { description: response.data.invites[0].team_description, admin:response.data.invites[0].admin, team:response.data.invites[0].team_name, id:response.data.invites[0].id } });
          }
        } catch (error) {
          // Request failed
          console.log("[ERROR] Request failed: " + error);
        }
        break;
        
      case 'message':
        read_notification(notification[0]);
        break;

      case 'survey':
        break;

      case 'event':
        break;

      case 'admin':
        break;
        
      default:
        console.log('Not the right case!');
    }
  }

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
