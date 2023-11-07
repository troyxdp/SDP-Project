import React, { useState } from "react";
import { TextField } from "@mui/material";
import './styles.css';

const Search = () => {
    // State variables
    const [searchQuery, setSearchQuery] = useState("");  // To store the search query
    const [user, setUser] = useState(null);  // To store the user data from the search
    const [error, setError] = useState(false);  // To handle errors

    // Handle search button click
    const handleSearch = () => {
        // In a real application, you would perform a search using an API or a database.
        // For demonstration, we'll use static data here.
        // Replace the static data with your actual data source.

        // Simulate searching for a user with a display name matching the search query.
        const foundUser = {
            displayName: "John Doe",
            photoURL: "user.jpg",
        };

        // Set the found user data to display it.
        setUser(foundUser);
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
        setSearchQuery("");
    }

    return (
        <div className="searchBar">
            <div className="searchForm">
                <TextField
                    InputLabelProps={{style: {color: 'black', fontSize: 20, fontFamily: 'cursive', fontStyle:'oblique'} }}
                    inputProps={{style: {color:"black", fontSize: 17}}}
                    fullWidth
                    type="text"
                    label="Search users..." 
                    variant="standard" 
                    onKeyDown={handleKeyDown}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            {user && 
                <div className="userChatList" onClick={handleSelectChat}>
                    <img src={user.photoURL} alt="" />
                    <div className="userChatItem">
                        <span>{user.displayName}</span>
                    </div>
                </div>
            }
            {error && <span>User not found!</span>}
        </div>
    )
}

export default Search;
