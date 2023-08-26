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
      


      const endpoint = `http://localhost:5000/home/delete-account`;

      // Mak a DELETE request


      try {
        // Send a POST request to the /newtask endpoint of the Flask server
        const response = await axios.post(endpoint, {
          username:username,
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
