import React, { useEffect, useRef } from "react";

const Message = ({ message }) => {
  // For Firebase, replace the following static data with Firebase data
  const staticCurrentUser = {
    uid: "staticUserId",
    photoURL: "staticUserPhoto.jpg",
  };

  const staticData = {
    user: {
      photoURL: "staticUserProfilePhoto.jpg",
    },
  };

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const isUserMessage = message.senderId === staticCurrentUser.uid;
  const messageClass = `message ${isUserMessage ? "owner" : ""}`;

  return (
    <div ref={ref} className={messageClass}>
      <div className="messageInfo">
        <img
          src={isUserMessage ? staticCurrentUser.photoURL : staticData.user.photoURL}
          alt=""
        />
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
        <span>just now</span>
        {message.img && <img src={message.img} alt="" />}
      </div>
    </div>
  );
};

export default Message;
