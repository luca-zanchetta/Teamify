import { useNavigate } from "react-router-dom";
import "../css/confirmation.css";
import { handleRevert } from "./Profile";
import axios from "axios";

import { address, flask_port } from "./Endpoint";

interface Props {
  type: string;
  message: string;
  task_id?: integer;
  id?: integer;
  dU?: string;
}

function PopUp({ type, task_id, message, id, dU }: Props) {
  const navigate = useNavigate();

  console.log(type, message, id, dU);
  console.log("popup");

  const handleConfirmation = async () => {
    if (type === "account") {
      const decryptedUsername = localStorage.getItem("username");
      const username = localStorage.getItem("LoggedUser");

      const endpoint = address + flask_port + `/home/delete-account`;

      // Mak a DELETE request

      try {
        // Send a POST request to the /newtask endpoint of the Flask server
        const response = await axios.post(endpoint, {
          username: decryptedUsername,
        });
        // If task has been successfully created, then redirect the user to the Home page.
        console.log(response.status);
        if (response.status === 200) {
          console.log("Account deleted successfully");
          localStorage.clear();
          sessionStorage.clear();
          navigate("/login");
          window.location.replace(window.location.href);
        }
      } catch (error) {
        // There is at least one mandatory field that has not been filled
        console.log("ERROR", error);
      }
    } else if (type === "task") {
      console.log("delete");
      try {
        const response = await axios.delete(
          address + flask_port + `/home/deletetask/${task_id}`
        );
        if (response.status === 200) {
          localStorage.setItem("delete", false);
          localStorage.setItem("task_to_delete", 0);
          window.location.reload();
          // TODO: add alert
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleRevertTask = () => {
    localStorage.setItem("delete", false);
    localStorage.setItem("task_to_delete", 0);
    window.location.reload();
  };

  const handleLeaveTeam = async () => {
    try {
      const response = await axios.delete(
        address + flask_port + `/home/teams/leaveteam`,
        {
          data: null, // Send an empty data object to indicate no request body
          params: { teamId: id, username: dU }, // Add params if needed
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

  const handleRevertReload = () => {
    window.location.reload();
  };

  const handleRemoveAdmin = async () => {
    //adminToRemove in dU, id team in id
    try {
      const response = await axios.delete(
        address + flask_port + `/home/teams/team/removeadmin`,
        {
          data: null, // Send an empty data object to indicate no request body
          params: { teamId: id, admin_to_remove: dU }, // Add params if needed
        }
      );
      if (response.status === 200) {
        // If the deletion was successful, update local storage and reload the page
        sessionStorage.setItem("removed_admin", "true");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle any errors that occur during the DELETE request
    }
  };

  return (
    <div className="MessageContainer" id="message-container">
      <div className="CardPopUP">
        <h1>{message}</h1>
        <div className="row">
          <div className="col">
            <button
              className="btn btn-outline-danger"
              onClick={
                (type == "leaveTeam" && handleLeaveTeam) ||
                (type == "deleteTeam" && handleDelete) ||
                (type == "removeAdmin" && handleRemoveAdmin) ||
                handleConfirmation
              }
            >
              Confirm
            </button>
          </div>
          <div className="col">
            <button
              className="btn btn-outline-secondary"
              onClick={
                (type === "account" && handleRevert) ||
                (type == "task" && handleRevertTask) ||
                handleRevertReload
              }
            >
              Revert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PopUp;
