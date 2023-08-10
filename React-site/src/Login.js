import './Css/App.css';
import './Css/Login.css'

import {Link} from 'react-router-dom'

import React, { useState } from 'react';
import axios from 'axios';

var endpoint = 'http://localhost:5000/login'

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
        // Send a POST request to the /login endpoint of the Flask server
        const response = await axios.post(endpoint, { username, password });
        // Display received data (debugging purposes)
        console.log("\nUsername: "+response.data.username+"\nPassword: "+response.data.password);
    } 
    catch (error) {   // Or something else
        // Error message
        console.log("[ERROR] Request failed! "+error);
    }
  };
  
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
            <form onSubmit={handleSubmit}>
              <div className='InputEntry'>
                <div className='InputLabel'>
                  Username
                </div>
                <input className='InputField' type='text' placeholder='Enter your username' id='username' onChange={(event)=>setUsername(event.target.value)}>
                </input>
              </div>
              <div className='InputEntry'>
                <div className='InputLabel'>
                  Password
                </div>
                <input className='InputField' type='password' placeholder='Enter your password' id='password' onChange={(event)=>setPassword(event.target.value)}>
                </input>
              </div>
              <hr/>
              <input type='submit' value={"Login"} id='Login'></input>
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
