import React, { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase-config/firebase";
import { TextField } from "@mui/material";
import './styles.css';
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
  margin-top: 40px; /* Space for the search results */
`;

const UserChat = styled.div`
  /* Your user chat styles here */
`;

const Search = () => {
  // State variables
  const [userName, setUserName] = useState(""); // To store the search query
  const [users, setUsers] = useState([]); // To store the user data from the search
  const [error, setError] = useState(false); // To handle errors
  const [chatOpen, setChatOpen] = useState(false); // To manage chat window visibility
  const [selectedUser, setSelectedUser] = useState(null); // To store the selected user

  // Handle search button click
  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("fullName", ">=", userName),
      where("fullName", "<=", userName + "/uf8ff")
    );

    try {
      const querySnapshot = await getDocs(q);
      const usersData = [];
      querySnapshot.forEach((doc) => {
        usersData.push(doc.data());
      });
      setUsers(usersData);
    } catch (err) {
      setError(true);
    }
  };

  // Handle Enter key press to trigger search
  const handleKeyDown = (e) => {
    if (e.code === "Enter") {
      handleSearch();
    }
  };

  // Handle selecting a user and starting a chat
  const handleSelectChat = (user) => {
    setSelectedUser(user);
    setChatOpen(true);
  };

  // Close the chat window
  const closeChat = () => {
    setChatOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="searchBar">
      <div className="searchForm">
        <TextField
          InputLabelProps={{ style: { color: 'black', fontSize: 20, fontWeight: 'bolder' } }}
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

      {users.length > 0 && (
        <ResultsContainer visible={!chatOpen}>
          <h3>Search Results:</h3>
          {users.map((user, index) => (
            <ResultRow key={index} onClick={() => handleSelectChat(user)}>
              <img
                src={user.photoURL}
                alt=""
              />
              <div className="userDetails">
                <NameSpan>{user.fullName}</NameSpan>
                {user.email && <EmailSpan>{user.email}</EmailSpan>}
              </div>
            </ResultRow>
          ))}
        </ResultsContainer>
      )}
      <UserChatContainer>
        {chatOpen && (
          <UserChat>
            {/* User chat content goes here */}
            {/* <button onClick={closeChat}>Close Chat</button> */}
            <p>Chat with {selectedUser.fullName}</p>
          </UserChat>)
        }
      </UserChatContainer>
    </div>
  );
};

export default Search;
