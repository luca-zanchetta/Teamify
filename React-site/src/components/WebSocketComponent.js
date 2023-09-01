import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import io from 'socket.io-client';

import alarm from "../icons/alarm.png";

import { address, flask_port } from './Endpoint';

const WebSocketComponent =  forwardRef((props, ref) => {
  const username = localStorage.getItem('LoggedUser');

  const sendMessage = () => {
    console.log('CHIAMATA');
  };

  useImperativeHandle(ref, () => ({
    sendMessage:sendMessage,
  }));

  useEffect(() => {
    // New WebSocket connection at start
    const newSocket = io(address+flask_port);

    newSocket.on('connect', () => {
      console.log('[INFO] Connected to the WebSocket server.');

      // Send to the server the username of the logged user
      newSocket.emit('initial_data', username);
    });

    // Receive messages from the server
    newSocket.on('message', (message) => {
      // setMessages((prevMessages) => [...prevMessages, message]);
      console.log('[INFO] Received message: '+message);
    });


    // Notifications from the server
    newSocket.on('invite_notification', (message) => {
      // setMessages((prevMessages) => [...prevMessages, message]);
      console.log('[INFO] Received notification: '+message);
      var bellIcon = document.getElementById('bell');
      bellIcon.src = alarm;
    });

    newSocket.on('message_notification', (message) => {
      console.log('[INFO] Received notification: '+message);
      var bellIcon = document.getElementById('bell');
      bellIcon.src = alarm;
    });

    newSocket.on('event_notification', (message) => {
      console.log('[INFO] Recieved notification: '+message);
      var bellIcon = document.getElementById('bell');
      bellIcon.src = alarm;
    });

    newSocket.on('survey_notification', (message) => {
      console.log('[INFO] Recieved notification: '+message);
      var bellIcon = document.getElementById('bell');
      bellIcon.src = alarm;
    });


    // Chiudi la connessione WebSocket quando il componente viene smontato
    return () => {
      if (newSocket && !username) {
        newSocket.disconnect();
      }
    };
  }, []);

  return (
    <div></div>
  );

});

export {WebSocketComponent};