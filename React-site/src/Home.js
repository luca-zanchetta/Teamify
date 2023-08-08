import './Css/App.css';
import './Css/Homepage.css'
import {TopBar,BarHeading} from './Css/Login.css'
import {Link} from 'react-router-dom'

import calendar from './icons/calendar.png'
import paper from './icons/paper.png'
import profits from './icons/profits.png'
import savings from './icons/savings.png'

function Home() {
  return ( 
    <div className='App'>
      <div className='TopBar'>
          <div className='BarHeading'>
            <Link to ="/"  style={{ color: 'inherit', textDecoration: 'inherit'}}>
              Teamify
            </Link> 
          </div>
          <div className='MenuOptions'>

          </div>
          <div className='Buttons'>
            <div className='LogIn'>
                <Link to ="/login"  style={{ color: 'inherit', textDecoration: 'inherit'}}>
                    Log In
                </Link> 
            </div>
            <div className='SignUp'>
                <Link to ="/signup"  style={{ color: 'inherit', textDecoration: 'inherit'}}>
                    Sing Up
                </Link> 
            </div>
          </div> 
      </div>
      <div className='CenterContainer'>
        <div className='TextContainer'>
          <h1>
            Lorem ipsum dolor sit amet
          </h1>
            Ut enim ad minim veniam, 
            quis nostrum exercitationem ullam corporis suscipit laboriosam,
            nisi ut aliquid ex ea commodi consequatur.
        </div>
        <div className='CardContainer'>
          <div className='Card'>
            <div className='CardIcon'>
              <img src={calendar}></img>
            </div>
            <div className='CardText'>
              <h4>
                Build and ship faster using simple tools
              </h4>
              <h5>
                All of our products are built with simplicity at their core, 
                so you can spend your time focusing on building apps, 
                not infrastructure.
              </h5>
            </div>
          </div>
          <div className='Card'>
            <div className='CardIcon'>
              <img src={paper}></img>
            </div>
            <div className='CardText'>
              <h4>
                Build and ship faster using simple tools
              </h4>
              <h5>
                All of our products are built with simplicity at their core, 
                so you can spend your time focusing on building apps, 
                not infrastructure.
              </h5>
            </div>
          </div>
          <div className='Card'>
            <div className='CardIcon'>
              <img src={profits}></img>
            </div>
            <div className='CardText'>
              <h4>
                Build and ship faster using simple tools
              </h4>
              <h5>
                All of our products are built with simplicity at their core, 
                so you can spend your time focusing on building apps, 
                not infrastructure.
              </h5>
            </div>
          </div>
          <div className='Card'>
            <div className='CardIcon'>
              <img src={savings}></img>
            </div>
            <div className='CardText'>
              <h4>
                Build and ship faster using simple tools
              </h4>
              <h5>
                All of our products are built with simplicity at their core, 
                so you can spend your time focusing on building apps, 
                not infrastructure.
              </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;