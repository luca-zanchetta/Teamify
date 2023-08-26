import { useNavigate } from "react-router-dom";
import "../css/confirmation.css";
import { handleRevert } from "./Profile";
import axios from "axios";

interface Props {
  type: string;
  task_id?: integer;
}

function PopUp({ type, task_id }: Props) {
  const navigate = useNavigate();
  const handleConfirmation = async () => {
    if (type === "account") {
      const decryptedUsername = localStorage.getItem("username");
      const username = localStorage.getItem("LoggedUser");


      const endpoint = `http://localhost:5000/home/delete-account/${username}`;

      // Mak a DELETE request
      fetch(endpoint, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data === "ok") {
            console.log("Account deleted successfully");
            localStorage.clear();
            sessionStorage.clear();
            navigate("/login");
            window.location.replace(window.location.href);
          } else {
            console.error("Failed to delete account");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else if (type === "task") {
      console.log("delete");
      try {
        const response = await axios.delete(
          `http://localhost:5000/home/deletetask/${task_id}`
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

  return (
    <div className="MessageContainer" id="message-container">
      <div className="CardPopUP">
        <h1>Do you want to delete this {type}?</h1>
        <div className="row">
          <div className="col">
            <button
              className="btn btn-outline-danger"
              onClick={handleConfirmation}
            >
              Confirm
            </button>
          </div>
          <div className="col">
            <button
              className="btn btn-outline-secondary"
              onClick={type === "account" ? handleRevert : handleRevertTask}
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
