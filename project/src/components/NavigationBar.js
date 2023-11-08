import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore"; // Import necessary Firebase Firestore functions
import { getFirestore } from "firebase/firestore";
const db = getFirestore(); 
const Container = styled.div`
  background: #a13333;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center; /* Change from 'align-content' to 'align-items' */
  height: 60px;
  max-height: 60px;
`;

const NavigationDisplay = styled.button`
  color: white;
  background-color: transparent;
  border: none; /* Change 'border: 0px solid #a13333;' to 'border: none;' */
  width: 150px;
  display: flex; /* Remove 'flex-wrap' */
  justify-content: center;
  align-items: center; /* Change from 'align-content' to 'align-items' */
  font-weight: bold;
`;

const SearchInput = styled.input`
  padding: 5px;
  border: 1px solid white;
  background: transparent;
  color: white;
`;

const FilterDropdown = styled.select`
  padding: 5px;
  border: 1px solid white;
  background: transparent;
  color: white;
`;

const smallerButtonStyle = {
  width: '98px',
  height: '28px',
  margin: 'auto',
};

const SearchContainer = styled.div`
  display: flex;
  align-items: center; /* Change from 'align-content' to 'align-items' */
`;

export function NavigationBar() {
  const [userEmail] = useState(sessionStorage.getItem("userEmail"));
  const [filter, setFilter] = useState("Event Planner");
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [err, setErr] = useState(false); // Add state for error handling
  const [user, setUser] = useState(null); // Add state for user data
  const [username, setUsername] = useState(""); // State to store the search username

  const navigate = useNavigate();

  const routeToProfilePage = (e) => {
    e.preventDefault();
    navigate("/profilePage", { state: userEmail });
  };

  const routeToConnectionsPage = (e) => {
    e.preventDefault();
    navigate("/connectionsPage");
  };

  const routeToMessagesPage = (e) => {
    e.preventDefault();
    navigate("/messagesPage");
  };

  const routeToRequestsPage = (e) => {
    e.preventDefault();
    navigate("/requestsPage");
  };

  const logout = (e) => {
    e.preventDefault();
    navigate("/loginPage");
    sessionStorage.setItem('userEmail', "");
  }

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const search = async () => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
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
    if (e.code === "Enter") {
      search();
    }
  };

  return (
    <Container>
      <NavigationDisplay onClick={routeToConnectionsPage}>Connections</NavigationDisplay>
      <NavigationDisplay onClick={routeToMessagesPage}>Messages</NavigationDisplay>
      <NavigationDisplay onClick={routeToRequestsPage}>Requests</NavigationDisplay>
      <NavigationDisplay onClick={routeToProfilePage}>Profile</NavigationDisplay>
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search"
          value={searchInput}
          onChange={handleSearchInputChange}
          onKeyDown={handleKey} // Add onKeyDown event to trigger search on Enter key
        />
        <button onClick={search} style={smallerButtonStyle}>Search</button>
        <NavigationDisplay onClick={logout}>Sign Out</NavigationDisplay>
      </SearchContainer>
    </Container>
  );
}
