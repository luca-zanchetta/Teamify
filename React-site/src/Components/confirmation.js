import { useState } from 'react';
import '../Css/confirmation.css';


function PopUp() {

  return ( 
    <div className='MessageContainer'>
        <div className='CardPopUP'>
            <h1>
                Do you want to delete your account?
            </h1>
            <div className='Button'>
                <div style={{backgroundColor:'red'}}> confirm </div>
                <div> revert </div>
            </div>
        </div>
    </div>
  );
}

export default PopUp;