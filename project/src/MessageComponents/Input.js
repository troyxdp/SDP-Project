import React, { useContext, useState } from "react";
import Img from "../assets/img.png";
import Attach from "../assets/attach.png";
import './styles.css';
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import styled from "styled-components";

const Sendbutton = styled.button`
  // margin-bottom: 30px;
  padding: 10px 30px;
  font-size: 12px;
  vertical-align: middle; /* Adjust the vertical alignment as needed */
`;



const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  // Replace currentUser and data with static data for testing/demonstration
  const currentUser = { uid: "user1" };
  const data = { chatId: "chat1", user: { uid: "user2" } };

  const handleSend = async () => {
    // Simulate sending a message
    const newMessage = {
      id: "message1",
      text,
      senderId: currentUser.uid,
      date: new Date().toLocaleString(),
      img: img || null,
    };

    console.log("Sending message:", newMessage);

    // Clear the input fields
    setText("");
    setImg(null);
  };

  return (
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
      />
      <div className="send">
        <input
          type="file"
          style={{ display: "none" }}
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
                justifyContent: "space-between",
                verticalAlign: 'middle',
              }}
            />
          </label>
          <Sendbutton onClick={handleSend}>Send</Sendbutton>
        </div>
      </div>
    </div>
  );
};

export default Input;