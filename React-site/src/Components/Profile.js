import '../Css/Profile.css';


import setting from '../icons/setting.png'

import { useState } from 'react';
import face from '../img/face.jpeg'
import edit from '../icons/edit.png'


function Profile() {
    const [show, setShow] = useState(false)

    function ToggleUserMenu() {
        setShow(!show)  
    }


    return ( 
    <div className='Profile'>
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
                  Name Surname
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
                  Personal Informations
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
                    TizianaX
                  </h2>
                </div>
              </div>
              <div className='Row'>
                <div className='TextEntry'>
                  <h4>
                    First Name
                  </h4>
                  <h2>
                    Tiziana
                  </h2>
                </div>
                <div className='TextEntry'>
                  <h4>
                    First Name
                  </h4>
                  <h2>
                    Tiziana
                  </h2>
                </div>
              </div>
              <div className='Row'>
                <div className='TextEntry'>
                  <h4>
                    Email
                  </h4>
                  <h2>
                    Tiziana@ayoooo.it
                  </h2>
                </div>
                <div className='TextEntry'>
                  <h4>
                    Birth Date
                  </h4>
                  <h2>
                    12/12/2000
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