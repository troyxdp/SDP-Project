import React, { useEffect, useRef } from "react";

const Message = ({ message }) => {
  // Replace currentUser and data with static data
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

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === staticCurrentUser.uid && "owner"}`}
    >
      <div className="messageInfo">
        <img
          src={
            message.senderId === staticCurrentUser.uid
              ? staticCurrentUser.photoURL
              : staticData.user.photoURL
          }
          alt=""
        />
        <span>just now</span>
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
        {message.img && <img src={message.img} alt="" />}
      </div>
    </div>
  );
};

export default Message;
