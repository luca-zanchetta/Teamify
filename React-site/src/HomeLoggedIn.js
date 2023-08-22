import "./css/App.css";
import "./css/Homepage.css";

import WeeklyCalendar from "./components/WeeklyCalendar.js";
import { Container } from "./css/Navigator.css";
import { Link, useNavigate, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import TopBar from "./components/TopBar";
import UserIcon from "./components/UserIcon";
import Notifications from "./components/Notifications";
import Profile from "./components/Profile";
import Alert from "./components/Alert.tsx";

function HomeLoggedIn() {
  const username = localStorage.getItem("LoggedUser");
  const ProfileData = localStorage.getItem("ProfileData") === "true";
  const navigate = useNavigate();

  if (!username) {
    // If the user is not logged in, (s)he has to login first.
    navigate("/login");
  }

  // Alert variable and function
  const new_task = sessionStorage.getItem("new_task") === "true";
  const handleClosure = () => {
    sessionStorage.setItem("new_task", false);
    //sessionStorage.setItem("error_alert", false);
  };

  const ToggleDisplayAgenda = () => {
    localStorage.setItem("ProfileData", "false");
    navigate("home");
  };

  /* ALERT SECTION */

  const login_200 = sessionStorage.getItem("login_alert") === "true";
  const handleLogin = () => {
    sessionStorage.setItem("login_alert", "false");
  };

  // Handler for data updated succesfully
  const dataUpdate = sessionStorage.getItem("dataUpdate_alert") === "true";
  const handleDataUpdate = () => {
    sessionStorage.setItem("dataUpdate_alert", "false");
  };

  // Handler for data update error event
  const dataUpdateErr = sessionStorage.getItem("dataUpdateErr_alert") === "true";
  const handleDataUpdateErr = () => {
    sessionStorage.setItem("dataUpdateErr_alert", "false");
  };

  // Handler for wrong password event
  const wrongPassword = sessionStorage.getItem("wrongPassword_alert") === "true";
  const handleWrongPassword = () => {
    sessionStorage.setItem("wrongPassword_alert", "false");
  }

  // Handler for password updated successfully
  const rightPassword = sessionStorage.getItem("rightPassword_alert") === "true";
  const handleRightPassword = () => {
    sessionStorage.setItem("rightPassword_alert", "false");
  }

  // Handler for new password not long enough
  const wrongPassword8 = sessionStorage.getItem("password8_alert") === "true";
  const handleWrongPassword8 = () => {
    sessionStorage.setItem("password8_alert", "false");
  }

  // ALERT DI MATTEO QUI

  /* END ALERT SECTION */

  return (
    <div className="App">
      {!username && <Navigate to="/login" />}
      <div className="TopBar">
        <div className="BarHeading">
          <Link
            to="/"
            style={{ color: "inherit", textDecoration: "inherit" }}
            onClick={ToggleDisplayAgenda}
          >
            Teamify
          </Link>
        </div>
        <div className="MenuOptions">
          <TopBar></TopBar>
        </div>
        <div className="Buttons">
          <Notifications></Notifications>
          <UserIcon></UserIcon>
        </div>
      </div>
      {login_200 && (
        <Alert onClick={handleLogin} state="success">
          Welcome {username}!
        </Alert>
      )}
      {new_task && (
        <Alert onClick={handleClosure} state="success">
          New task correctly created!
        </Alert>
      )}
      {dataUpdate && (
        <Alert onClick={handleDataUpdate} state="success">
          User data has been updated!
        </Alert>
      )}
      {rightPassword && (
        <Alert onClick={handleRightPassword} state="success">
          Password has been updated!
        </Alert>
      )}
      {wrongPassword && (
        <Alert onClick={handleWrongPassword} state="danger">
          The original password was not correct!
        </Alert>
      )}
      {dataUpdateErr && (
        <Alert onClick={handleDataUpdateErr} state="danger">
          Error during data update.
        </Alert>
      )}
      {wrongPassword8 && (
        <Alert onClick={handleWrongPassword8} state="danger">
          The new password must contain at least 8 characters!
        </Alert>
      )}

      {/* ALERT DI MATTEO QUI */}
      
      <div className="SideContainer">
        <NavBar></NavBar>
        <div className="CenterContainer">
          {!ProfileData && (
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
          )}
          {ProfileData && <Profile></Profile>}
        </div>
      </div>
    </div>
  );
}

export default HomeLoggedIn;
