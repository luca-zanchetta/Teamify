import "../css/Navigator.css";

import { Link, useNavigate, navigate } from "react-router-dom";
import calendar from "../icons/calendar.png";

import paper from "../icons/paper.png";
import profits from "../icons/profits.png";
import savings from "../icons/savings.png";

function NavBar() {
  const navigate = useNavigate();

  const ToggleTeams = () => {
    navigate("/home/teams");
  };

  return (
    <div className="NavContainer">
      <div className="IconContainer">
        <div className="IconEntry">
          <img src={calendar}></img>
        </div>
        <div className="IconEntry">
          <img src={paper} onClick={ToggleTeams}></img>
        </div>

        <div className="IconEntry">
          <img src={profits}></img>
        </div>
        <div className="IconEntry">
          <img src={savings}></img>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
