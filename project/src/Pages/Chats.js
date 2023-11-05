import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import './styles.css';

const Chats = () => {
  // Initialize chats with an empty object
  const [chats, setChats] = useState({});

  // Access the ChatContext and AuthContext
  const { dispatch } = useContext(ChatContext);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    // Function to retrieve chats (you can replace this with your actual data retrieval logic)
    const getChats = () => {
      if (currentUser) {
        // Simulate data retrieval by setting static data
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
        };

        setChats(staticChats);
      }
    };

    if (currentUser && currentUser.uid) {
      getChats();
    }
  }, [currentUser]);

  // Function to handle chat selection
  const handleChatSelection = (userInfo) => {
    dispatch({ type: "CHANGE_USER", payload: userInfo });
  }

  return (
    <div>
      {chats && Object.entries(chats).map((chat) => (
        <div
          className="userChatList"
          key={chat[0]}
          onClick={() => handleChatSelection(chat[1].userInfo)}
        >
          <img src={chat[1].userInfo.photoURL} alt="" />
          <div className="userChatItem">
            <span>{chat[1].userInfo.displayName}</span>
            <p>{chat[1].lastMessage?.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Chats;
