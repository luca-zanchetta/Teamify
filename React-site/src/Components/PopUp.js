import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/confirmation.css";
import { handleRevert } from "./Profile";

function PopUp() {
  const navigate = useNavigate();

  const handleConfirmation = () => {
    const endpoint = `/home/delete-account?user=${localStorage.getItem("LoggedUser")}`;

    // Make a DELETE request
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
  };

  return (
    <div className="MessageContainer" id="message-container">
      <div className="CardPopUP">
        <h1>Do you want to delete your account?</h1>
        <div className="Button">
          <div style={{ backgroundColor: "red" }} onClick={handleConfirmation}>
            confirm
          </div>
          <div onClick={handleRevert}> revert </div>
        </div>
      </div>
    </div>
  );
}

export default PopUp;
