import './Css/App.css';
import './Css/Login.css'
import { Link, useNavigate } from 'react-router-dom';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

var endpoint = 'http://localhost:5000/reset'

function Reset() {
    // Form data
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [password_again, setPasswordAgain] = useState("");

    // For redirecting
    const navigate = useNavigate()

    // Handler for the event 'Submit of a form'
    const handleSubmit = async (event) => {
        event.preventDefault();

        if(username !== "" && password !== "" && password_again !== "") {
            if(password === password_again) {
                if(password.length >= 8) {
                    try {
                        // Send a POST request to the /reset endpoint of the Flask server
                        const response = await axios.post(endpoint, { username, password });
                        
                        // If the reset has been successfully performed, then redirect the user to the Login page.
                        // Sarebbe più carino un avviso di successo o qualcosa di simile
                        if (response.status === 200) {
                            navigate("/login");
                        }
                        else if (response.status === 400) {
                            alert('[ERROR] Something bad happened: reset was unsuccessful :(');
                        }
                        else if (response.status === 404) {
                            alert('[ERROR] The user was not found in the system.');
                        }
                    } 
                    catch (error) {
                        // Error message
                        console.log("[ERROR] Request failed: "+error);
                    }
                }
                else {
                    alert('The password must contain at least 8 characters!');
                }
            }
            else {  // Passwords do not match
                alert('The inserted passwords do not match!');
            }
        }
        else {  // There is at least one mandatory field that has not been filled
            alert('All the fields must be filled!');
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
      <div className='SignUpBackground'>
        <div className='CardL'>
                <div className='CardHeading'>
                Reset your password
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
                    New Password (at least 8 characters)
                    </div>
                    <input className='InputField' type='password' placeholder='Enter your new password' id='password1' onChange={(event)=>setPassword(event.target.value)}>
                    </input>
                </div>
                <div className='InputEntry'>
                    <div className='InputLabel'>
                    Repeat New Password
                    </div>
                    <input className='InputField' type='password' placeholder='Enter again your new password' id='password2' onChange={(event)=>setPasswordAgain(event.target.value)}>
                    </input>
                </div>
                <hr/>
                <input type='submit' value={"Register"} id='Login'>
                </input>
                </form>

            </div>
        </div>
    </div>  
    );
}

export default Reset;
