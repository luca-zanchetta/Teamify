import "./Css/App.css";
import "./Css/Homepage.css";

import NavBar from "./Components/NavBar";
import TopBar from "./Components/TopBar";
import WeeklyCalendar from "./Components/WeeklyCalendar.js";
import Alert from "./Components/Alert.tsx";
import { Container } from "./Css/Navigator.css";

import { Link, useNavigate } from "react-router-dom";
import UserIcon from "./Components/UserIcon";

function HomeLoggedIn() {
  const loggedIn = localStorage.getItem("user");
  console.log(loggedIn);

  const navigate = useNavigate();

  //alert variable and function
  const new_task = sessionStorage.getItem("new_task") === "true";
  const handleClosure = () => {
    sessionStorage.setItem("new_task", false);
    //sessionStorage.setItem("error_alert", false);
  };

  if (!loggedIn) {
    // If the user is not logged in, (s)he has to login first.
    navigate("/login");
  }

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
      {new_task && (
        <Alert onClick={handleClosure} state="success">
          New task correctly created!
        </Alert>
      )}
      <div className="SideContainer">
        <NavBar></NavBar>
        <div className="CenterContainer">
          <div className="container mt-5" width="100%">
            <div className="row text-center">
              <div className="col">
                <h3 className="mb-3 mr-10">Personal Agenda</h3>
                <WeeklyCalendar width={1000} height={570} />
              </div>
              <div className="col"></div>
              <div className="col">
                <div className="row text-center mt-5">
                  <h5>Filter</h5>
                </div>
                <div className="row">
                  <Link
                    to="/home/newtask"
                    className="personalized-button"
                    style={{
                      textDecoration: "inherit",
                    }}
                  >
                    New Task
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeLoggedIn;
