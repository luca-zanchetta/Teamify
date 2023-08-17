import '../Css/Profile.css';
import setting from '../icons/setting.png'
import { useState } from 'react';
import face from '../img/face.jpeg'
import edit from '../icons/edit.png'
import axios from "axios";

var endpoint = "http://localhost:5000/home";


function Profile() {
    const [show, setShow] = useState(false);
    const username = localStorage.getItem('LoggedUser');
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [birth, setBirth] = useState("");

    function ToggleUserMenu() {
        setShow(!show)  
    }

    const show_data = async (event) => {
      try {
        // Send a POST request to the /login endpoint of the Flask server
        const response = await axios.post(endpoint, {
          username
        }).catch(
          function (error) {
            if(error.response) {
              // Print error data
              console.log("Data: "+error.response.data);
              console.log("Status: "+error.response.status);
              console.log("Headers: "+error.response.headers);
            }
          }
        );
  
        setName(response.data['name']);
        setSurname(response.data['surname']);
        setBirth(response.data['birth']);
        setEmail(response.data['email']);
      } 
      catch (error) {
        // Request failed
        console.log("[ERROR] Request failed: " + error);
      }
    }


    return ( 
    <div className='Profile' onLoad={show_data}>
      <div className='ProfileCard'>
        <div className='ProfileNav'>
        
          <div className='ProfileNavEntry'>
            <input type='radio' id="Profile" name="nav"/>
            <label for="Profile">My Profile</label>
          </div>
          <div className='ProfileNavEntry'>
            <input type='radio' id="Team" name="nav" />
            <label for="Profile">Teams</label>
          </div>
          <div className='ProfileNavEntry'>
            <input type='radio' id="Notification" name="nav" />
            <label for="Profile">Notifications</label> 
          </div>
          <div className='ProfileNavEntry' style={{paddingTop : '15%', color: 'red'}}>
            Delete Account
          </div>
        </div>
        <div id='divider'></div>
        <div className='ProfileContent'>
          <div className='ContentEntry'>
            <div className='HorizontalContainer'>
              <div className='ProfileIcon'>
                <img src={face}></img>
              </div>
              <div className='ProfileInfos'>
                <h2>
                  {name} {surname}
                </h2>
                <h3>
                  Team Manager
                </h3>
                <h4>
                  Leeds, United Kingdoms
                </h4>
              </div>
              <div className='EditButton'>
                edit
                <img src={edit}></img>
              </div>
            </div>
          </div>
          <div className='ContentEntry'>
            <div className='VerticalContainer'>
              <div className='Row'>
                <div className='Title'>
                  Personal Information
                </div>
                <div className='EditButton'>
                  edit
                  <img src={edit}></img>
                </div>
              </div>
              <div className='Row'>
                <div className='TextEntry'>
                  <h4>
                    Username
                  </h4>
                  <h2>
                    {username}
                  </h2>
                </div>
              </div>
              <div className='Row'>
                <div className='TextEntry'>
                  <h4>
                    Name
                  </h4>
                  <h2>
                    {name}
                  </h2>
                </div>
                <div className='TextEntry'>
                  <h4>
                    Surname
                  </h4>
                  <h2>
                    {surname}
                  </h2>
                </div>
              </div>
              <div className='Row'>
                <div className='TextEntry'>
                  <h4>
                    Email
                  </h4>
                  <h2>
                    {email}
                  </h2>
                </div>
                <div className='TextEntry'>
                  <h4>
                    Birth Date
                  </h4>
                  <h2>
                    {birth}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
}


export default Profile;