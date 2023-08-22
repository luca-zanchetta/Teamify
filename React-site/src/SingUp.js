import "./css/App.css";
import "./css/Login.css";
import { Link } from "react-router-dom";
import Login from "./Login";

function SignUp() {
  return (
    <div className="App">
      <div className="TopBar">
        <div className="BarHeading">
          <Link to="/" style={{ color: "inherit", textDecoration: "inherit" }}>
            Teamify
          </Link>
        </div>
        <div className="barSignUp">
          Already have an account?
          <div
            className="Link"
            style={{ paddingLeft: "2%", fontSize: "large" }}
          >
            <Link to="/login">Sign In</Link>
          </div>
        </div>
      </div>
      <div className="SignUpBackground">
        <div className="CardL">
          <div className="CardHeading">Register your account</div>
          <form>
            <div className="InputEntry">
              <div className="InputLabel">Username</div>
              <input
                className="InputField"
                type="text"
                placeholder="Enter your username"
              ></input>
            </div>
            <div className="InputEntry">
              <div className="InputLabel">Password</div>
              <input
                className="InputField"
                type="text"
                placeholder="Enter your password"
              ></input>
            </div>
            <hr />
            <input type="submit" value={"Register"} id="Login"></input>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
