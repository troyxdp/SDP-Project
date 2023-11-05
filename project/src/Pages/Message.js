import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import './styles.css';

const ChatBubble = ({ message }) => {
    const ref = useRef();
    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    // Ensure currentUser exists and has a uid property
    const isOwner = currentUser && currentUser.uid === message.senderId;

    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);

    return (
        <div
            ref={ref}
            className={`message ${isOwner ? "owner" : ""}`}
        >
            <div className="messageInfo">
                <img
                    src={
                        isOwner
                            ? "owner-profile-image.jpg" // Static image for the owner
                            : "other-user-profile-image.jpg" // Static image for the other user
                    }
                    alt=""
                />
                {/*Time for the messages*/}
                <span>just now</span>
            </div>
            <div className="messageContent">
                <p>{message.text}</p>
                {message.img && <img src={message.img} alt="" />}
            </div>
        </div>
    );
}

export default ChatBubble;
