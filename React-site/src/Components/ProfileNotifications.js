import '../Css/Navigator.css';
import '../Css/Profile.css';
import {Link} from 'react-router-dom'
import bell from '../icons/bell.png'
import team from '../icons/team.png'
import event from '../icons/event.png'

import { useState } from 'react';



function ProfileNotifications() {

    return ( 
    <div className='ProfileContent'>
        <div className='NotificationEntry' style={{width: '100%'}}>
            <div className='NotificationIcon'>
                <img src={event}></img>
            </div>
            <div className='NotificatioTitles'>
                <h3>Team C</h3>
                <h4>Tizio created a new event!</h4>
            </div>
        </div>
        <div className='NotificationEntry' style={{width: '100%'}}>
            <div className='NotificationIcon'>
                <img src={event}></img>
            </div>
            <div className='NotificatioTitles'>
                <h3>Team C</h3>
                <h4>Tizio created a new event!</h4>
            </div>
        </div>
        <div className='NotificationEntry' style={{width: '100%'}}>
            <div className='NotificationIcon'>
                <img src={event}></img>
            </div>
            <div className='NotificatioTitles' >
                <h3>Team C</h3>
                <h4>Tizio created a new event!</h4>
            </div>
        </div>
        <div className='NotificationEntry' style={{width: '100%'}}>
            <div className='NotificationIcon'>
                <img src={event}></img>
            </div>
            <div className='NotificatioTitles'>
                <h3>Team C</h3>
                <h4>Tizio created a new event!</h4>
            </div>
        </div>
        <div className='NotificationEntry' style={{width: '100%'}}>
            <div className='NotificationIcon'>
                <img src={event}></img>
            </div>
            <div className='NotificatioTitles'>
                <h3>Team C</h3>
                <h4>Tizio created a new event!</h4>
            </div>
        </div>
    </div>
    );
}


export default ProfileNotifications;