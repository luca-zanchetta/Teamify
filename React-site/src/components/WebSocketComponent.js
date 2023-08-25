import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// const socket = new WebSocket('ws://localhost:5000');
// const username = localStorage.getItem('LoggedUser');

// socket.addEventListener('connect', () => {
//   console.log('[INFO] Connected to the WebSocket server.');

//   // Send to the server the username of the logged user
//   socket.emit('initial_data', username);
// });

// // Receive messages from the server
// socket.addEventListener('message', (message) => {
//   // setMessages((prevMessages) => [...prevMessages, message]);
//   console.log('[INFO] Received message: '+message);
// });

// export default socket;

const WebSocketComponent = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState(null);

  const username = localStorage.getItem('LoggedUser');

  useEffect(() => {
    // New WebSocket connection at start
    const newSocket = io('http://localhost:5000');

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

    setSocket(newSocket);

    // Chiudi la connessione WebSocket quando il componente viene smontato
    return () => {
      if (newSocket && !username) {
        newSocket.disconnect();
      }
    };
  }, []);

  const sendMessage = () => {
    if (socket && inputMessage.trim() !== '') {
      socket.emit('message', "ciao");
      setInputMessage('');
    }
  };

//   return (
//     <div>
//       <h1>WebSocket Example</h1>
//       <div>
//         {messages.map((message, index) => (
//           <div key={index}>{message}</div>
//         ))}
//       </div>
//       <input
//         type="text"
//         value={inputMessage}
//         onChange={(e) => setInputMessage(e.target.value)}
//       />
//       <button onClick={sendMessage}>Send</button>
//     </div>
//   );
};

export default WebSocketComponent;
