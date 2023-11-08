import React, { useState } from "react";

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase-config/firebase";

import { TextField } from "@mui/material";

import './styles.css';

const Search = () => {
    // State variables
    const [searchTag, setUserName] = useState("");  // To store the search query
    const [user, setUser] = useState(null);  // To store the user data from the search
    const [error, setError] = useState(false);  // To handle errors

    // Handle search button click
    const handleSearch = async () => {
        // In a real application, you would perform a search using an API or a database.
        // For demonstration, we'll use static data here.
        // Replace the static data with your actual data source.

        const q = query(
            collection(db, "users"), 
            where("fullName", ">=", searchTag),
            where("fullName", "<=", searchTag + "/uf8ff")
        );

        try{   
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setUser(doc.data())
            });
        }catch(err){
            setError(true)
        }

    }

    // Handle Enter key press to trigger search
    const handleKeyDown = (e) => {
        if (e.code === "Enter") {
            handleSearch();
        }
    }
        
    // Handle selecting a user and starting a chat
    const handleSelectChat = () => {
        // In a real application, you would handle chat selection.
        // For demonstration, you can print a message to the console.
        console.log("Starting a chat with:", user.displayName);

        // Clear the user and search query after starting the chat.
        setUser(null);
        setUserName("");
    }

    return (
        <div className="searchBar">
            <div className="searchForm">
                <TextField
                    InputLabelProps={{style: {color: 'black', fontSize: 20, fontWeight:'bolder'} }}
                    inputProps={{style: {color:"black", fontSize: 17}}}
                    fullWidth
                    type="text"
                    label="Search users..." 
                    variant="standard" 
                    onKeyDown={handleKeyDown}
                    value={searchTag}
                    onChange={(e) => setUserName(e.target.value)}
                />
            </div>
            {error && <span>User not found</span>}
            {user && 
                <div className="userChatList" onClick={handleSelectChat}>
                    <img 
                        src={user.photoURL} 
                        alt="" 
                    />
                    <div className="userChatItem">
                        <span>{user.fullName}</span>
                    </div>
                </div>
            }
            {error && <span>User not found!</span>}
        </div>
    )
}

export default Search;
