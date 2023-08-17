import './Css/App.css';
import './Css/Homepage.css'

import NavBar from './Components/NavBar';
import TopBar from './Components/TopBar';
import {Link, Navigate} from 'react-router-dom'
import UserIcon from './Components/UserIcon';
import Notifications from './Components/Notifications';
import Profile from './Components/Profile';
import Alert from "./Components/Alert.tsx";

const username = localStorage.getItem('LoggedUser');

function HomeLoggedIn() {

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
      <div className='SideContainer'>
        <NavBar></NavBar>
      </div>
    </div>
  );
}

export default HomeLoggedIn;