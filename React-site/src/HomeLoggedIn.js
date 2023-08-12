import './Css/App.css';
import './Css/Homepage.css'

import NavBar from './Components/NavBar';
import TopBar from './Components/TopBar';
import {Container} from './Css/Navigator.css'


import {Link, useNavigate} from 'react-router-dom'
import UserIcon from './Components/UserIcon';




function HomeLoggedIn() {
  const loggedIn = localStorage.getItem('user');
  const navigate = useNavigate();

  if(!loggedIn) {   // If the user is not logged in, (s)he has to login first.
    navigate('/login');
  }

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
    
      <div className='SideContainer'>
        <NavBar></NavBar>
      </div>
    </div>
  );
}

export default HomeLoggedIn;