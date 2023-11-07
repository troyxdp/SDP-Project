import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import './styles.css';

const Chats = () => {
  const [chats, setChats] = useState({});
  const [selectedChat, setSelectedChat] = useState(null);

  const { dispatch } = useContext(ChatContext);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const getChats = () => {
      if (currentUser) {
        const staticChats = {
          chatId1: {
            userInfo: {
              displayName: "User 1",
              photoURL: "user1.jpg",
            },
            lastMessage: {
              text: "Hello there!",
            },
          },
          chatId2: {
            userInfo: {
              displayName: "User 2",
              photoURL: "user2.jpg",
            },
            lastMessage: {
              text: "How are you?",
            },
          },
          chatId3: {
            userInfo: {
              displayName: "User 3",
              photoURL: "user2.jpg",
            },
            lastMessage: {
              text: "Hi",
            },
          },
        };

        setChats(staticChats);
      }
    };

    if (currentUser && currentUser.uid) {
      getChats();
    }
  }, [currentUser]);

  const handleChatSelection = (userInfo) => {
    setSelectedChat(userInfo);
    dispatch({ type: "CHANGE_USER", payload: userInfo });
  }

  return (
    <div>
      {chats && Object.entries(chats).map((chat) => (
        <div
          key={chat[0]}
          onClick={() => handleChatSelection(chat[1].userInfo)}
          className={selectedChat === chat[1].userInfo ? "selected" : "userChatList"}
        >
          <img src={chat[1].userInfo.photoURL} alt="" />
          <div>
            <span>{chat[1].userInfo.displayName}</span>
            <p>{chat[1].lastMessage?.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Chats;
