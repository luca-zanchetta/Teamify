import { useNavigate } from "react-router-dom";
import "../css/confirmation.css";
import { handleRevert } from "./Profile";
import React, { useState } from "react";
import axios from "axios";

interface Props {
  task: Object;
}
function Task({ task }: Props) {
  const navigate = useNavigate();
  const [updatedTask, setUpdatedTask] = useState([]);

  const handleConfirmation = () => {};

  const handleUpdateTask = async (taskId) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/home/updatetask/${taskId}`,
        updatedTask
      );
      console.log(response.data.message); // Display the response message
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="MessageContainer" id="message-container">
      <div className="CardPopUP">
        <h1>{task.title}</h1>
        <div className="row">
          <div className="col">
            <button
              className="btn btn-outline-danger"
              onClick={handleConfirmation}
            >
              confirm
            </button>
          </div>
          <div className="col">
            <button
              className="btn btn-outline-secondary"
              onClick={handleRevert}
            >
              revert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Task;
