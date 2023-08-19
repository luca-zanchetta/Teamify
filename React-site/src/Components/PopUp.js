import { useState } from "react";
import "../Css/confirmation.css";
import { handleConfirmation, handleRevert } from "./Profile";

function PopUp() {
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
