import React, { useContext, useState } from "react";
import Img from "../assets/img.png";
import Attach from "../assets/attach.png";
import './styles.css';
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

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
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="send">
        <img src={Attach} alt="" />
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;
