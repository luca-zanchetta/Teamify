import './Css/App.css';
import './Css/Homepage.css'

import WeeklyCalendar from "./Components/WeeklyCalendar.js";
import { Container } from "./Css/Navigator.css";
import { Link, useNavigate, Navigate } from "react-router-dom";
import NavBar from './Components/NavBar';
import TopBar from './Components/TopBar';
import UserIcon from './Components/UserIcon';
import Notifications from './Components/Notifications';
import Profile from './Components/Profile';
import Alert from "./Components/Alert.tsx";


function HomeLoggedIn() {
  const username = localStorage.getItem('LoggedUser');
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

  /* ALERT SECTION */

  const login_200 = sessionStorage.getItem("login_alert") === "true";
  const handleLogin = () => {
    sessionStorage.setItem("login_alert", "false");
  };

  /* END ALERT SECTION */

  return ( 
    <div className='App'>
      {!username && <Navigate to='/login' />}
      <div className='TopBar'>
          <div className='BarHeading'>
            <Link to ="/"  style={{ color: 'inherit', textDecoration: 'inherit'}}>
              Teamify
            </Link> 
          </div>
          <div className='MenuOptions'>
            <TopBar></TopBar>
          </div>
          <div className='Buttons'>
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
      <div className='SideContainer'>
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
