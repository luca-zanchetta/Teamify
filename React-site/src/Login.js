import "./Css/App.css";
import "./Css/Login.css";

import Alert from "./Components/Alert.tsx";
import { Link, useNavigate, Navigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";

var endpoint = "http://localhost:5000/login";
const loggedIn = localStorage.getItem('LoggedUser');

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // For redirecting
  const navigate = useNavigate();

  
  /* ALERT SECTION */


  const sign_up_200 = sessionStorage.getItem("sign_up_alert") === "true";
  const handleClosure = () => {
    sessionStorage.setItem("sign_up_alert", "false");
  };

  // Handler for missing fields error
  const missingFields = sessionStorage.getItem("fields_alert") === "true";
  const handleMissingFields = () => {
    sessionStorage.setItem("fields_alert", "false");
  };

  // Handler for request failed error
  const requestFailed = sessionStorage.getItem("request_failed_alert") === "true";
  const handleRequestFailed = () => {
    sessionStorage.setItem("request_failed_alert", "false");
  };

  // Handler for wrong username/password error
  const wrongPwd = sessionStorage.getItem("wrongPwd_alert") === "true"
  const handleWrongPwd = () => {
    sessionStorage.setItem("wrongPwd_alert", "false");
  };

  // Handler for username not found error
  const usernameNotFound = sessionStorage.getItem("usernameNotFound_alert") === "true"
  const handleUsernameNotFound = () => {
    sessionStorage.setItem("usernameNotFound_alert", "false");
  };


  /* END OF ALERT SECTION */


  // Handler for the event 'Submit of a form'
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Set form values
    localStorage.setItem('username', username);

    if (username !== "" && password !== "") {
      try {
        // Send a POST request to the /login endpoint of the Flask server
        const response = await axios.post(endpoint, {
          username,
          password 
        }).catch(
          function (error) {
            if(error.response) {
              // Print error data
              console.log("Data: "+error.response.data);
              console.log("Status: "+error.response.status);
              console.log("Headers: "+error.response.headers);
              
              // Handle error
              if(error.response.status === 400) {
                sessionStorage.setItem("wrongPwd_alert", "true");
                window.location.replace(window.location.href);  // For alert purposes only
                console.log("[ERROR] Username and/or password were not correct! Try again.");
              }
              else if(error.response.status === 404) {
                sessionStorage.setItem("usernameNotFound_alert", "true");
                window.location.replace(window.location.href);  // For alert purposes only
                console.log("[ERROR] The user was not found in the system.");
              }
            }
          }
        );

        // If the login has been successfully performed, then redirect the user to the homepage.
        if (response.status === 200) {
          localStorage.clear();
          localStorage.setItem("LoggedUser", username); // Set a session variable
          sessionStorage.setItem("login_alert", "true");
          navigate("/home");
        }
      } 
      catch (error) {
        // Request failed
        console.log("[ERROR] Request failed: " + error);
      }
    } 
    else {
      // There is at least one mandatory field that has not been filled
      sessionStorage.setItem("fields_alert", "true");
      window.location.replace(window.location.href);  // For alert purposes only
      console.log("All the fields must be filled!");
    }
  };

  return (
    <div className="App">
      {loggedIn && <Navigate to='/home' />}
      <div className="TopBar">
        <div className="BarHeading">
          <Link to="/" style={{ color: "inherit", textDecoration: "inherit" }}>
            Teamify
          </Link>
        </div>
        <div className="barSignUp">
          Don't have an account?
          <div
            className="Link"
            style={{ paddingLeft: "2%", fontSize: "large" }}
          >
            <Link to="/signup">Sign Up</Link>
          </div>
        </div>
      </div>
      {sign_up_200 && (
        <Alert onClick={handleClosure} state="success">
          Successfully signed up!
        </Alert>
      )}

      {requestFailed && (
        <Alert onClick={handleRequestFailed} state="danger">
          Error: Login failed.
        </Alert>
      )}

      {missingFields && (
        <Alert onClick={handleMissingFields} state="danger">
          All the fields must be filled!
        </Alert>
      )}

      {wrongPwd && (
        <Alert onClick={handleWrongPwd} state="danger">
          ERROR: Wrong username and/or password!
        </Alert>
      )}

      {usernameNotFound && (
        <Alert onClick={handleUsernameNotFound} state="danger">
          ERROR: username not found in the system!
        </Alert>
      )}
      <div className="CentralContainer">
        <div className="LeftContainer">
          <div className="CardL">
            <div className="CardHeading">Log into your account</div>
            <form onSubmit={handleSubmit}>
              <div className="InputEntry">
                <div className="InputLabel">Username</div>
                <input
                  className="InputField"
                  type="text"
                  placeholder="Enter your username"
                  id="username"
                  defaultValue={localStorage.getItem("username")}
                  onChange={(event) => setUsername(event.target.value)}
                ></input>
              </div>
              <div className="InputEntry">
                <div className="InputLabel">Password</div>
                <input
                  className="InputField"
                  type="password"
                  placeholder="Enter your password"
                  id="password"
                  onChange={(event) => setPassword(event.target.value)}
                ></input>
              </div>
              <hr />
              <input type="submit" value={"Login"} id="Login"></input>
            </form>
            <div className="Link" style={{ fontSize: "small" }}>
              <Link to="/reset">Forgot password?</Link>
            </div>
          </div>
        </div>
        <div className="RightContainer">
          <div className="Descriptor">
            <h2>
              Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod
              tempor incidunt ut labore et dolore magna aliqua.
            </h2>
            <h3>
              Ut enim ad minim veniam, quis nostrum exercitationem ullam
              corporis suscipit laboriosam, nisi ut aliquid ex ea commodi
              consequatur.
            </h3>
            <h3>
              Quis aute iure reprehenderit in voluptate velit esse cillum dolore
              eu fugiat nulla pariatur.
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
