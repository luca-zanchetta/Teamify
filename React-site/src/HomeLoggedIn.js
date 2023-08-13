import './Css/App.css';
import './Css/Homepage.css'

import NavBar from './Components/NavBar';
import TopBar from './Components/TopBar';

import {Link, useNavigate} from 'react-router-dom'
import UserIcon from './Components/UserIcon';
import Alert from "./Components/Alert.tsx";



function HomeLoggedIn() {
  const loggedIn = localStorage.getItem('LoggedUser');
  const navigate = useNavigate();

  if(!loggedIn) {   // If the user is not logged in, (s)he has to login first.
    navigate('/login');
  }

  /* ALERT SECTION */


  const login_200 = sessionStorage.getItem("login_alert") === "true";
  const handleLogin = () => {
    sessionStorage.setItem("login_alert", "false");
  };


  /* END ALERT SECTION */

  return ( 
    <div className='App'>
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
            <UserIcon></UserIcon>
          </div> 
      </div>
      {login_200 && (
        <Alert onClick={handleLogin} state="success">
          Welcome {loggedIn}!
        </Alert>
      )}
      <div className='SideContainer'>
        <NavBar></NavBar>
      </div>
    </div>
  );
}

export default HomeLoggedIn;