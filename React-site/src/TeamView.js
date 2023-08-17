import "./Css/App.css";
import "./Css/Homepage.css";

import NavBar from "./Components/NavBar";
import TopBar from "./Components/TopBar";
import WeeklyCalendar from "./Components/WeeklyCalendar.js";
import Alert from "./Components/Alert.tsx";
import { Container } from "./Css/Navigator.css";

import { Link, useNavigate } from "react-router-dom";
import UserIcon from "./Components/UserIcon";

//var endpoint = "http://localhost:5000/newtask"

function TeamView() {
  return (
    <div className="App">
      <div className="TopBar">
        <div className="BarHeading">
          <Link to="/" style={{ color: "inherit", textDecoration: "inherit" }}>
            Teamify
          </Link>
        </div>
        <div className="MenuOptions">
          <TopBar></TopBar>
        </div>
        <div className="Buttons">
          <UserIcon></UserIcon>
        </div>
      </div>

      <div className="SideContainer">
        <NavBar></NavBar>
        <div className="CenterContainer">
          <div className="CalendarContainer mt-5" width="100%">
            <div className="row text-center">
              <div className="col">
                <h3 className="CardL mb-3 mr-10">Shared Agenda</h3>
                <WeeklyCalendar height={600} width={1000} />
              </div>
              <div className="col"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeamView;
