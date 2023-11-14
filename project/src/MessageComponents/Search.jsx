import React, { useContext, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import styled from "styled-components";
import { db } from '../firebase-config/firebase';
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const ResultsContainer = styled.div`
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(100%);
  transform: translateY(20px);
  background: white;
  width: 300px;
  padding: 10px;
  border: 1px solid #aaaaaa;
  border-radius: 5px;
  z-index: 2000;
  display: ${props => props.visible ? "block" : "none"};
`;

const ResultRow = styled.div`
  margin: 10px 10px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
`;

const NameSpan = styled.span`
  margin-bottom: 5px;
  font-weight: bold;
`;

const EmailSpan = styled.span`
  font-size: 12px;
  color: #777;
`;

const SearchInput = styled.input`
  padding: 5px;
  height: 28px;
  width: 411px;
  border: 1px solid white;
  background: white;
  color: black;
  font-size: large;
`;

const smallerButtonStyle = {
  width: '98px',
  height: '30px',
  margin: 'auto',
};

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("searchName", ">", username.toLowerCase()),
      where("searchName", "<=", username.toLowerCase() + '\uf8ff')
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      setErr(true);
    }
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async () => {

    //check whether the group(chats in firestore) exists, if not create
    const combinedId =
      (currentUser.email > user.email
        ? currentUser.email + user.email
        : user.email + currentUser.email).replace(/\./g, '');

    try {

      console.log(currentUser);
      console.log(user);
      // console.log(combinedId);
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        //create user chats
        
        await updateDoc(doc(db, "userChats", currentUser.email), {
            [combinedId + ".userInfo"] : { 
                email: user.email, 
                displayName: user.displayName, 
                photoURL: user.profilePic, 
                date: serverTimestamp(), 
            },
        });

        await updateDoc(doc(db, "userChats", user.email), {
            [combinedId + ".userInfo"] : { 
                email: currentUser.email, 
                displayName: currentUser.displayName, 
                photoURL: user.profilePic, 
                date: serverTimestamp(), 
            },
        });
    }
        
    } catch (err) {}

    setUser(null);
    setUsername("") 
  };
  return (
    <div className="search">
      {err && <span>User not found!</span>}
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search"
          onKeyDown={handleKey}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </SearchContainer>
      {user && user.map && (
        <ResultsContainer visible={user.length > 0}>
          <h3>Search Results:</h3>
          {user.map((user, index) => (
            <ResultRow key={index} onClick={() => handleSelect(user)}>
              <NameSpan>{user.displayName}</NameSpan>
              {user.email && <EmailSpan>{user.email}</EmailSpan>}
            </ResultRow>
          ))}
        </ResultsContainer>
      )}
      {user && (
        <div className="userChat" onClick={handleSelect}>
          <img src={user.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;