import '../Css/Navigator.css';
import edit from '../icons/edit.png'
import face from '../img/face.jpeg'
import '../Css/Profile.css';
import axios from "axios";
import setting from '../icons/setting.png'
import { useState } from 'react';
var endpoint = "http://localhost:5000/home";


function UserInfo() {

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [birth, setBirth] = useState("");
    const username = localStorage.getItem('LoggedUser');

    const [editFlag, setEdit] = useState(false)
    const [editPass, setPass] = useState(false)

    function ToggleEdit() {
      setEdit(!editFlag)

    }

    function ToggleEditPass() {
        setPass(!editPass)
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

    return(
        <div className='ProfileContent'>
          <div className='ContentEntry'>
            <div className='HorizontalContainer'>
              <div className='ProfileIcon'>
                <img src={face}></img>
              </div>
              <div className='ProfileInfos'>
                <h2>
                  {username} , {name} {username}
                </h2>
                <h3>
                  Team Manager
                </h3>
                <h4>
                  Leeds, United Kingdoms
                </h4>
              </div>
            </div>
          </div>
          <div className='ContentEntry'>
            <div className='VerticalContainer'>
              <div className='Row'>
                <div className='Title'>
                  Account Informations
                </div>
                <div className='EditButton' onClick={ToggleEditPass}>
                    {
                      editPass && (<>Confirm</>)
                      ||
                      !editPass && (<>Edit</>)
                    }
                  <img src={edit}></img>
                </div>
              </div>
              <div className='Row'>
                <div className='TextEntry'>
                  <h4>
                    Password
                  </h4>
                  {
                    !editPass && (
                      <>
                        <h2>
                          ******************
                        </h2>
                      </>
                    ) 
                    ||
                    editPass && (
                      <>
                        <input type='text' value={surname}/>
                      </>
                    )
                  }
                </div>
                {
                    editPass && 
                        (
                        <>
                            <div className='TextEntry'>
                                <h4>
                                New password
                                </h4>
                                <input type='text' value={surname}/>
                            </div>
                            <div className='TextEntry'>
                                <h4>
                                Repeat new password
                                </h4>
                                <input type='text' value={surname}/>
                            </div>
                        </>
                        )
                }
              </div>
            </div>
          </div>
          <div className='ContentEntry'>
            <div className='VerticalContainer'>
              <div className='Row'>
                <div className='Title'>
                  Personal Information
                </div>
                <div className='EditButton' onClick={ToggleEdit}>
                    {
                      editFlag && (<>Confirm</>)
                      ||
                      !editFlag && (<>Edit</>)
                    }
                  <img src={edit}></img>
                </div>
              </div>
              <div className='Row'>
                <div className='TextEntry'>
                  <h4>
                    Name
                  </h4>
                  {
                    !editFlag && (
                      <>
                        <h2>
                          {name}
                        </h2>
                      </>
                    ) 
                    ||
                    editFlag && (
                      <>
                        <input type='text' value={name}/>
                      </>
                    )
                  }
                </div>
                <div className='TextEntry'>
                  <h4>
                    Surname
                  </h4>
                  {
                    !editFlag && (
                      <>
                        <h2>
                          {surname}
                        </h2>
                      </>
                    ) 
                    ||
                    editFlag && (
                      <>
                        <input type='text' value={surname}/>
                      </>
                    )
                  }
                </div>
              </div>
              <div className='Row'>
                <div className='TextEntry'>
                  <h4>
                    Email
                  </h4>
                  {
                    !editFlag && (
                      <>
                        <h2>
                          {email}
                        </h2>
                      </>
                    ) 
                    ||
                    editFlag && (
                      <>
                        <input type='text' value={email}/>
                      </>
                    )
                  }
                </div>
                <div className='TextEntry'>
                  <h4>
                    Birth Date
                  </h4>
                  {
                    !editFlag && (
                      <>
                        <h2>
                          {birth}
                        </h2>
                      </>
                    ) 
                    ||
                    editFlag && (
                      <>
                        <input type='date' value={birth}/>
                      </>
                    )
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
    );
}


export default UserInfo;