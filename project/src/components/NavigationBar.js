import React, { useState } from "react";
import {Link} from "react-router-dom";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
const db = getFirestore();

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  background: #a13333;
`;
const ItemsContainer = styled.div`
  background: #a13333;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px;
`;
const ResultsContainer = styled.div`
  position: absolute;
  top: 10px;
  right: 110px;
  transform: translateX(100%);
  transform: translateY(20px);
  background: white;
  width: 300px;
  padding: 10px;
  border: 1px solid #aaaaaa;
  border-radius: 5px;
  margin-top: 10px;
  z-index: 200;
`;
const ResultRow = styled.div`
  margin: 5px 0;
  cursor: pointer;
  display: flex;
  flex-direction: column;
`;
const NameSpan = styled.span`
  margin-bottom: 5px; /* Add margin to create space between name and email */
`;
const EmailSpan = styled.span`
  font-size: 12px; /* Adjust the font size for email */
  color: #777; /* Change the color of the email text */
`;
const NavigationDisplay = styled.button`
  color: white;
  background-color: transparent;
  border: none;
  width: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
`;
const SearchInput = styled.input`
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
  align-items: center;
`;

export function NavigationBar() {
  const [userName, setUserName] = useState("");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(false);
  const [userEmail] = useState(sessionStorage.getItem("userEmail"));
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  const routeToProfilePage = (userId) => {
    navigate(`/profilePage`, {state : userId}); // Pass the user's ID as a parameter
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
    setUserName(e.target.value);
  };
  const routeToProfilePageUser = (userId) => {
    navigate(`/profilePage`, { state: userId });
    // Clear the search results when navigating to the profile page
    setUsers([]);
  };

  const routeToNotificationsPage = () => {
    navigate("/notificationsPage");
  }
  
  const search = async () => {
    const q = query(
      collection(db, "users"),
      where("searchName", ">=", userName.toLowerCase()),
      where("searchName", "<=", userName.toLowerCase() + "\uf8ff")
    );
  
    try {
      const querySnapshot = await getDocs(q);
      const usersData = [];
      querySnapshot.forEach((doc) => {
        usersData.push(doc.data());
      });
      console.log("Query results:", usersData); // Add this line for debugging
      setUsers(usersData);
    } catch (err) {
      console.error("Error occurred while searching:", err); // Add this line for debugging
      setError(true);
    }
  };
  
  
  const handleKeyDown = (e) => {
    if (e.code === "Enter") {
      search();
    }
  };

  return (
    <Container>
      <ItemsContainer>
        <NavigationDisplay onClick={() => routeToProfilePage(userEmail)}>Profile</NavigationDisplay>
        <NavigationDisplay onClick={routeToConnectionsPage}>Connections</NavigationDisplay>
        <NavigationDisplay onClick={routeToMessagesPage}>Messages</NavigationDisplay>
        <NavigationDisplay onClick={routeToRequestsPage}>Requests</NavigationDisplay>
        <NavigationDisplay onClick={() => routeToNotificationsPage()}>Notifications</NavigationDisplay>
      </ItemsContainer>
      <ItemsContainer>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Search"
            onKeyDown={handleKeyDown}
            value={userName}
            onChange={handleSearchInputChange}
          />
          <button onClick={search} style={smallerButtonStyle}>Search</button>
        </SearchContainer>
        {users.length > 0 && (
          <ResultsContainer visible={users.length > 0}>
            <h3>Search Results:</h3>
            {users.map((user, index) => (
              <ResultRow key={index} onClick={() => routeToProfilePageUser(user.email)}>
                <NameSpan>{user.displayName}</NameSpan>
                {user.email && <EmailSpan>{user.email}</EmailSpan>}
              </ResultRow>
            ))}
          </ResultsContainer>
        )}
        {error && <p>Error occurred while searching.</p>}
        <NavigationDisplay onClick={logout}>Sign Out</NavigationDisplay>
      </ItemsContainer>
    </Container>
  );
}
