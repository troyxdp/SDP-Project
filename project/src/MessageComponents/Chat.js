import React, { useContext } from "react";
import Add from "../img/add.png";
import More from "../img/more.png";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../context/ChatContext";
import './styles.css';

const Chat = () => {
  // Get the chat data from the context
  const { data } = useContext(ChatContext);

  // Static user data for testing/demonstration
  const staticUserData = {
    displayName: "John Doe", // Replace with your desired user data
  };

  return (
    <div className="chat">
      <div className="chatInfo">
        {/* Display user's name (static data for testing) */}
        <span>{staticUserData.displayName}</span>
        <div className="chatIcons">
          <img src={More} alt="More" />
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
