import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const [user, setUser] = useState(null);

  // Define getCurrentTime before using it
  const getCurrentTime = () => {
    const currentDate = new Date();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    return `${hours}:${minutes}`;
  };

  const [timestamp, setTimestamp] = useState(() => getCurrentTime()); // Initialize with the result of getCurrentTime
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const getCurrentDate = () => {
    const currentDate = new Date();
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return currentDate.toLocaleDateString(undefined, options);
  };

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser.email && "owner"}`}
    >
      <div className="messageInfo">
        <div className="userInfo">
          {user?.photoURL && <img src={user.photoURL} alt="" />}
          {user?.searchName && <span>{user.searchName}</span>}
        </div>
        <div className="timestamp">
          <span>{timestamp}</span>
        </div>
        <div className="date">
          <span>{getCurrentDate()}</span>
        </div>
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
        {message.img && <img src={message.img} alt="" />}
      </div>
    </div>
  );
};

export default Message;
