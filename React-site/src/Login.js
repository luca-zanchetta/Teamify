import './Css/App.css';
import './Css/Login.css'

import {Link} from 'react-router-dom'

function Login() {
  return (
    <div className='App'>
      <div className='TopBar'>
        <div className='BarHeading'>
          <Link to ="/"  style={{ color: 'inherit', textDecoration: 'inherit'}}>
            Teamify
          </Link>
        </div>
        <div className='barSignUp'>
          Don't have an account? 
          <div className='Link' style={{ paddingLeft: '2%', fontSize: 'large'}}>
            <Link to ="/signup">
                Sign Up
            </Link>
          </div>
  
        </div>
      </div>
      <div className='CentralContainer'>
        <div className='LeftContainer'>
          <div className='CardL'>
            <div className='CardHeading'>
              Log into your account
            </div>
            <form>
              <div className='InputEntry'>
                <div className='InputLabel'>
                  Username
                </div>
                <input className='InputField' type='text' placeholder='Enter your username'>
                </input>
              </div>
              <div className='InputEntry'>
                <div className='InputLabel'>
                  Password
                </div>
                <input className='InputField' type='text' placeholder='Enter your password'>
                </input>
              </div>
              <hr/>
              <input type='submit' value={"Login"} id='Login'>
              </input>
            </form>
            <div className='Link' style={ {fontSize: 'small'}}>
              Forgot password?
            </div>

          </div>
        </div>
        <div className="RightContainer">
          <div className='Descriptor'> 
            <h2>
            Lorem ipsum dolor sit amet, 
            consectetur adipisci elit, 
            sed eiusmod tempor incidunt ut labore et dolore magna aliqua.
            </h2>
            <h3>
              Ut enim ad minim veniam, 
              quis nostrum exercitationem ullam corporis suscipit laboriosam,
              nisi ut aliquid ex ea commodi consequatur.
            </h3>
            <h3>
            Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
            </h3>
          </div>
        </div>
      </div>
    </div>  
  );
}

export default Login;
