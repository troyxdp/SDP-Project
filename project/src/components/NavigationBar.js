import React, { useState } from "react";
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
  background: white;
  width: 300px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 10px;
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
    navigate(`/profilePage`, {state : userEmail}); // Pass the user's ID as a parameter
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

  const search = async () => {
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

  const handleKeyDown = (e) => {
    if (e.code === "Enter") {
      search();
    }
  };

  return (
    <Container>
      <ItemsContainer>
        <NavigationDisplay onClick={routeToConnectionsPage}>Connections</NavigationDisplay>
        <NavigationDisplay onClick={routeToMessagesPage}>Messages</NavigationDisplay>
        <NavigationDisplay onClick={routeToRequestsPage}>Requests</NavigationDisplay>
        <NavigationDisplay onClick={() => routeToProfilePage(userEmail)}>Profile</NavigationDisplay>
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
          <ResultsContainer>
            <h3>Search Results:</h3>
            {users.map((user, index) => (
              <ResultRow key={index} onClick={() => routeToProfilePage(user.userId)}>
                <NameSpan>{user.fullName}</NameSpan>
                {user.email && <span className="email">{user.email}</span>}
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
