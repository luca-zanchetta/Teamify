import '../Css/Profile.css';
import setting from '../icons/setting.png'
import { useState } from 'react';

import UserInfo from './UserInfo';
import ProfileNotifications from './ProfileNotifications';
import PopUp from './confirmation';




function Profile() {
    const [currentTab, setTab] = useState(1);
    const [show, setShow] = useState(false);



    function ToggleUserMenu() {
      setShow(!show)  
    }

    function SetTab(id) {
      setTab(id)
    }

    return ( 
      <>
    <PopUp></PopUp>
    <div className='Profile'>
      <div className='ProfileCard'>
        <div className='ProfileNav'>  
          <div className='ProfileNavEntry' onClick={() => SetTab(1)}>
            <input type='radio' id="Profile" name="nav" checked={1==currentTab}/>
            <label for="Profile">My Profile</label>
          </div>
          <div className='ProfileNavEntry' onClick={() => SetTab(2)}>
            <input type='radio' id="Team" name="nav" />
            <label for="Team">Teams</label>
          </div>
          <div className='ProfileNavEntry' onClick={() => SetTab(3)}>
            <input type='radio' id="Notification" name="nav" />
            <label for="Notification">Notifications</label> 
          </div>
          <div className='ProfileNavEntry' style={{paddingTop : '15%', color: 'red'}}>
            Delete Account
          </div>
        </div>
        <div id='divider'></div>
        {
          currentTab == 1 && (<UserInfo></UserInfo>)
          ||
          currentTab == 2 && (<UserInfo></UserInfo>)
          ||
          currentTab == 3 && (<ProfileNotifications></ProfileNotifications>)
        }
          
      </div>
    </div>
  </>
    );
}


export default Profile;