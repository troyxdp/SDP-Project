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

import { db } from '../firebase-config/firebase';
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

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
      currentUser.email > user.email
        ? currentUser.email + user.email
        : user.email + currentUser.email;

    try {
      // console.log(combinedId);
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        //create user chats

        const userUserChatsDocRef = doc(db, "userChats", currentUser.email);
        const userUserChatsDocSnapshot = await getDoc(userUserChatsDocRef);
        const userUserChatsData = userUserChatsDocSnapshot.data();
        userUserChatsData[combinedId + ".userInfo"] = {email: user.email, displayName: user.displayName, photoURL: user.photoURL};
        userUserChatsData[combinedId + ".date"] = serverTimestamp();
        
        await updateDoc(doc(db, "userChats", currentUser.email), {
          [combinedId + ".userInfo"]: {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.email), {
          [combinedId + ".userInfo"]: {
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }


      const currentUserRef = doc(db, "userChats", currentUser.email);

      await updateDoc(doc(db, "userChats", currentUser.email), {
          test: `${user.email},${user.displayName}`
        });
    } catch (err) {}

    setUser(null);
    setUsername("") 
  };
  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find a user"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      {err && <span>User not found!</span>}
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