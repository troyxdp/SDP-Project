import React, { useContext, useState, useEffect } from 'react';
import { ChatContext } from '../context/ChatContext';
import { db } from "../firebase-config/firebase";
import styled from 'styled-components';
import './styles.css';
import { collection, getDocs, query, where } from "firebase/firestore";
import Message from './Message';
import Img from '../assets/img.png';

const Sendbutton = styled.button`
  padding: 10px 30px;
  font-size: 12px;
  vertical-align: middle;
`;

const Right = styled.div`
  text-align: right;
  gap: 100px;
`;

const InputAndMessages = () => {
  const [text, setText] = useState('');
  const [img, setImg] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userName, setUserName] = useState("");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(false);

  const { data } = useContext(ChatContext);

  const formatTimestamp = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return new Date(date).toLocaleString(undefined, options);
  };

  const addMessage = (newMessage) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const handleSend = () => {
    // Simulate sending a message
    const newMessage = {
      id: messages.length + 1,
      text,
      senderId: 'user1',
      date: new Date().toISOString(),
      senderName: "User1",
      senderProfilePicture: 'URL_TO_PROFILE_PICTURE',
      // img: img || null,
    };

    addMessage(newMessage);

    // Clear the input fields
    setText('');
    setImg(null);
  };

  useEffect(() => {
    // Replace this static data with data related to the selected chat
    const staticMessages = [
      { id: 1, text: 'Hello!', sender: 'user1', date: '2023-11-10T12:30:00' },
      { id: 2, text: 'Hi there!', sender: 'user2', date: '2023-11-10T12:35:00' },
      { id: 3, text: 'How are you?', sender: 'user1', date: '2023-11-10T12:40:00' },
      { id: 4, text: "I'm good, thanks!", sender: 'user2', date: '2023-11-10T12:45:00' },
    ];

    // Set the static messages as the initial state
    setMessages(staticMessages);
  }, [data.selectedChat]);

  return (
    <div>
      <div className="messages">
        {messages.map((message, index) => (
          <div key={message.id} className={message.senderId === 'user1' ? 'left' : 'right'}>
            <div className="sender-name">{message.senderName}</div>
            <Message message={message} />
            <div className="timestamp">{formatTimestamp(message.date)}</div>
          </div>
        ))}
      </div>
      <div className="input">
        <input
          type="text"
          placeholder="Messages..."
          onChange={(e) => setText(e.target.value)}
          value={text}
          style={{
            width: '250px',
            height: '40px',
            fontSize: '18px',
          }}
          onKeyDown={(e) => {
            if (e.code === "Enter") {
              handleSend();
            }
          }}
        />
        <div className="send">
          <input
            type="file"
            style={{ display: 'none' }}
            id="file"
            onChange={(e) => setImg(e.target.files[0])}
          />
          <div className="send-container">
            <label htmlFor="file">
              <img
                src={Img}
                alt=""
                style={{
                  width: '40px',
                  height: '40px',
                  justifyContent: 'space-between',
                  verticalAlign: 'middle',
                }}
              />
            </label>
            <Sendbutton onClick={handleSend}>Send</Sendbutton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputAndMessages;
