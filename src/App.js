import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const socket = io('http://localhost:5000');

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    socket.on('messageReadNotification', (message) => {
      console.log('Message read:', message);
      toast(`Your message "${message.text}" was read by the receiver.`)
      // alert(`Your message "${message.text}" was read by the receiver.`);
    });
  
    return () => {
      socket.off('messageReadNotification');
    };
  }, []);
  

  const sendMessage = async () => {
    if (message.trim()) {
      const response = await axios.post('http://localhost:5000/api/messages', { text: message, read: false });
      socket.emit('sendMessage', response.data);
      setMessage('');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Sender Application</h2>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send Message</button>
      <ToastContainer/>
    </div>
  );
}

export default App;
