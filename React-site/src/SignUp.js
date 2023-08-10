import './Css/App.css';
import './Css/Login.css'
import { Link } from 'react-router-dom';

import React, { useState } from 'react';
import axios from 'axios';

var endpoint = 'http://localhost:5000/signup'

function SignUp() {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [birth, setBirth] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [password_again, setPasswordAgain] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        if(password == password_again) {
            try {
                // Send a POST request to the /signup endpoint of the Flask server
                const response = await axios.post(endpoint, { name, surname, birth, email, username, password });
                // Display received data (debugging purposes)
                console.log("\nName: "+response.data.name+
                            "\nSurname: "+response.data.surname+
                            "\nDate of Birth: "+response.data.birth+
                            "\nEmail: "+response.data.birth+
                            "\nUsername: "+response.data.username+
                            "\nPassword: "+response.data.password);
            } 
            catch (error) {     // Or something else
                // Error message
                console.log("[ERROR] Request failed! "+error);
            }
        }
        else {
            alert('The inserted passwords do not match!');  // Or something else bad :)
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
                <form>
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
                <input type='submit' value={"Register"} id='Register'>
                </input>
                </form>

            </div>
        </div>
    </div>  
    );
}

export default SignUp;
