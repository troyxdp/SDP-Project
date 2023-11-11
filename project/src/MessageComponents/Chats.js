import React, { useContext, useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase-config/firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import './styles.css';
import { TextField } from "@mui/material";
import Search from "./Search";
import styled from "styled-components";

const ResultsContainer = styled.div`
  background: white;
  width: 300px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  overflow-y: auto;
  display: ${props => props.visible ? "block" : "none"};
`;

const ResultRow = styled.div`
  margin: 5px 0;
  cursor: pointer;
  display: flex;
  flex-direction: column;
`;

const NameSpan = styled.span`
  margin-bottom: 5px;
  font-weight: bold;
`;

const EmailSpan = styled.span`
  margin-top: 5px;
  color: #a9a9a9;
`;

const UserChatContainer = styled.div`
  position: relative;
  margin-top: 40px;
  overflow: hidden;
`;

const UserChat = styled.div`
  background-color: #1041d4;
  border: 2px solid black;
  align-content: center;
  height: 60px;
  padding: 10px;
  font-weight: bold;
  color: white;
`;

const Chats = () => {
  const [chats, setChats] = useState({});
  const [selectedChat, setSelectedChat] = useState(null);
  const [userName, setUserName] = useState("");
  const [users, setUsers] = useState([]); // Changed this to 'users'
  const [error, setError] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { dispatch } = useContext(ChatContext);
  const { currentUser } = useContext(AuthContext);

  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("searchName", ">", userName.toLowerCase()),
      where("searchName", "<=", userName.toLowerCase() + "\uf8ff")
    );

    try {
      const querySnapshot = await getDocs(q);
      const usersData = [];
      querySnapshot.forEach((doc) => {
        usersData.push(doc.data());
      });
      setUsers(usersData); // Updated to 'users'
      setError(false);
    } catch (err) {
      setError(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.code === "Enter") {
      handleSearch();
    }
  };

  const handleSelectChat = (user) => {
    setSelectedUser(user);
    addUserToChats(user);
    setUsers([]); // Clear the search results
  };
  
  const closeChat = () => {
    setChatOpen(false);
    setSelectedUser(null);
  };

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
              text: "...",
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
  };

  const addUserToChats = (userInfo) => {
    const newUserChat = {
      userInfo: userInfo,
      lastMessage: {
        text: "Say hello!",
      },
    };

    setChats((prevChats) => {
      return {
        ...prevChats,
        [userInfo.uid]: newUserChat,
      };
    });
  };

  return (
    <div>
      <div className="searchBar">
        <div className="searchForm">
          <TextField
            InputLabelProps={{ style: { color: 'black', fontSize: 20, fontWeight: 'bolder' }}}
            inputProps={{ style: { color: "black", fontSize: 17 } }}
            fullWidth
            type="text"
            label="Search users..."
            variant="standard"
            onKeyDown={handleKeyDown}
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        {error && <span className="error">User not found</span>}
        {users.length > 0 && ( // Updated to 'users'
          <ResultsContainer visible={!chatOpen}>
            <h3>Search Results:</h3>
            {users.map((user, index) => (
              <ResultRow key={index} onClick={() => handleSelectChat(user)}>
                <img src={user.photoURL} alt="" />
                <div className="userDetails">
                  <NameSpan>{user.displayName}</NameSpan>
                  {user.email && <EmailSpan>{user.email}</EmailSpan>}
                </div>
              </ResultRow>
            ))}
          </ResultsContainer>
        )}
      </div>
      <div className="chatContainer">
        {Object.values(chats).map((chat, index) => (
          <div
            key={index}
            onClick={() => handleChatSelection(chat.userInfo)}
            className={selectedChat === chat.userInfo ? "selected" : "userChatList"}
          >
            <img src={chat.userInfo.photoURL} alt="" />
            <div>
              <span>{chat.userInfo.displayName}</span>
              <p>{chat.lastMessage?.text}</p>
            </div>
          </div>)
        )}
      </div>
    </div>
  );
};

export default Chats;



