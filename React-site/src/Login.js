import "./Css/App.css";
import "./Css/Login.css";
import Alert from "./Components/Alert.tsx";

import { Link, useNavigate, useLocation } from "react-router-dom";

import React, { useState } from "react";
import axios from "axios";

var endpoint = "http://localhost:5000/login";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // For redirecting
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const registrationSuccess = queryParams.get("success");

  const handleClosure = () => {
    console.log("Close popup");
  };

  // Handler for the event 'Submit of a form'
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (username !== "" && password !== "") {
      try {
        // Send a POST request to the /login endpoint of the Flask server
        const response = await axios.post(endpoint, { username, password });

        // If the login has been successfully performed, then redirect the user to the homepage.
        // Sarebbe più carino un avviso di successo o qualcosa di simile
        if (response.status === 200) {
          localStorage.setItem('user', username);   // Set a session variable
          navigate("/home");
          // localStorage.clear(); per rimuovere tutte le variabili settate
          // localStorage.removeItem('user');
        } else if (response.status === 400) {
          alert(
            "[ERROR] Username and/or password were not correct! Try again."
          );
        } else if (response.status === 404) {
          alert("[ERROR] The user was not found in the system.");
        }
      } catch (error) {
        // Error message
        console.log("[ERROR] Request failed: " + error);
      }
    } else {
      // There is at least one mandatory field that has not been filled
      alert("All the fields must be filled!");
    }
  };

  return (
    <div className="App">
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
      {registrationSuccess && (
        <Alert onClick={handleClosure}>Successfully signed up!</Alert>
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
