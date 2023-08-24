import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const WebSocketComponent = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Stabilisci la connessione WebSocket quando il componente si monta
    const newSocket = io('http://localhost:5000');  // Sostituisci con l'URL del tuo server

    newSocket.on('connect', () => {
      console.log('[INFO] Connected to the WebSocket server.');

      // Send to the server the username of the logged user
      const username = localStorage.getItem('LoggedUser');
      newSocket.emit('initial_data', username);
    });

    // Ricevi i messaggi dal server
    newSocket.on('message', (message) => {
      // setMessages((prevMessages) => [...prevMessages, message]);
      console.log('[INFO] Received message: '+message);
    });

    setSocket(newSocket);

    // Chiudi la connessione WebSocket quando il componente viene smontato
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  const sendMessage = () => {
    if (socket && inputMessage.trim() !== '') {
      socket.emit('message', inputMessage);
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
