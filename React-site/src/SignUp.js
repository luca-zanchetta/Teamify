import './Css/App.css';
import './Css/Login.css'
import { Link, useNavigate } from 'react-router-dom';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

var endpoint = 'http://localhost:5000/signup'

function SignUp() {
    // Form data
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [birth, setBirth] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [password_again, setPasswordAgain] = useState("");

    // For redirecting
    const navigate = useNavigate()

    // Handler for the event 'Submit of a form'
    const handleSubmit = async (event) => {
        event.preventDefault();

        if(name !== "" || surname !== "" || birth !== "" || email !== "" || username !== "" || password !== "" || password_again !== "") {
            if(password === password_again && password !== "") {
                try {
                    // Send a POST request to the /signup endpoint of the Flask server
                    const response = await axios.post(endpoint, { name, surname, birth, email, username, password });
                    
                    // If the signup has been successfully performed, then redirect the user to the Login page.
                    // Sarebbe più carino un avviso di successo o qualcosa di simile
                    if (response.status === 200) {
                        navigate("/login");
                    }
                    else if (response.status === 400) {
                        alert('[ERROR] Something bad happened: registration was unsuccessful :(')
                    }
                } 
                catch (error) {
                    // Error message
                    console.log("[ERROR] Request failed: "+error);
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
          Already have an account?
            <div className='Link' style={{ paddingLeft: '2%', fontSize: 'large'}}>
                <Link to ="/login" >
                    Sign In
                </Link>
            </div>
        </div>
      </div>
      <div className='SignUpBackground'>
        <div className='CardL'>
                <div className='CardHeading'>
                Register your account
                </div>
                <form onSubmit={handleSubmit}>
                <div className='InputEntry'>
                    <div className='InputLabel'>
                    Name
                    </div>
                    <input className='InputField' type='text' placeholder='Enter your name' id='name' onChange={(event)=>setName(event.target.value)}>
                    </input>
                </div>
                <div className='InputEntry'>
                    <div className='InputLabel'>
                    Surname
                    </div>
                    <input className='InputField' type='text' placeholder='Enter your surname' id='surname' onChange={(event)=>setSurname(event.target.value)}>
                    </input>
                </div>
                <div className='InputEntry'>
                    <div className='InputLabel'>
                    Birth Date
                    </div>
                    <input className='InputField' type='date' placeholder='dd/mm/yyy' id='birth' onChange={(event)=>setBirth(event.target.value)}>
                    </input>
                </div>
                <div className='InputEntry'>
                    <div className='InputLabel'>
                    Email
                    </div>
                    <input className='InputField' type='text' placeholder='your.email@example.com' id='email' onChange={(event)=>setEmail(event.target.value)}>
                    </input>
                </div>
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
                    <input className='InputField' type='password' placeholder='Enter your password' id='password1' onChange={(event)=>setPassword(event.target.value)}>
                    </input>
                </div>
                <div className='InputEntry'>
                    <div className='InputLabel'>
                    Repeat Password
                    </div>
                    <input className='InputField' type='password' placeholder='Enter again your password' id='password2' onChange={(event)=>setPasswordAgain(event.target.value)}>
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

export default SignUp;
