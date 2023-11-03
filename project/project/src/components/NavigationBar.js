import React, { useState } from "react";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";

const Container = styled.div`
    background: #a13333;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-content: center;
    height: 60px;
    max-height: 60px;
`;
const NavigationDisplay = styled.button`
    color: white;
    background-color: transparent;
    border: 0px solid #a13333;
    width: 150px;
    flex-wrap: wrap;
    display: flex;
    text-align: center;
    justify-content: center;
    align-content: center;
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
    width: '100px',
    height: '30px',
    margin: 'auto', // This centers the button horizontally
    marginTop: '15px', // This adds some top margin for vertical centering
    marginBottom: '10px', // This adds some bottom margin for vertical centering
  
  };

export function NavigationBar() {
    const [userEmail] = useState(sessionStorage.getItem("userEmail"));
    const [filter, setFilter] = useState("Event Planner"); // Default to Event Planner
    const [searchInput, setSearchInput] = useState("");
    const [searchResults, setSearchResults] = useState([]);
  
    const navigate = useNavigate();
  
    const routeToProfilePage = async (e) => {
      e.preventDefault();
      navigate("/profilePage", { state: userEmail });
    };
  
    const routeToConnectionsPage = async (e) => {
      e.preventDefault();
      navigate("/connectionsPage");
    };
  
    const routeToMessagesPage = async (e) => {
      e.preventDefault();
      navigate("/messagesPage");
    };
  
    const routeToRequestsPage = async (e) => {
      e.preventDefault();
      navigate("/requestsPage");
    };
  
    const handleFilterChange = (e) => {
      setFilter(e.target.value);
    };
  
    const handleSearchInputChange = (e) => {
      setSearchInput(e.target.value);
    };
  
    const search = async () => {
      // Implement Firebase query here based on filter and searchInput
      // Update the searchResults state with the results
      // Example: Firebase query goes here and updates searchResults
      <Container>
            <select value={filter} onChange={handleFilterChange}>
            <option value="Event Planner">Event Planner</option>
            <option value="Performer">Performer</option>
          </select>
      </Container>
    };
  
    return (
        <Container>
        <NavigationDisplay onClick={routeToConnectionsPage}>Connections</NavigationDisplay>
        <NavigationDisplay onClick={routeToMessagesPage}>Messages</NavigationDisplay>
        <NavigationDisplay onClick={routeToRequestsPage}>Requests</NavigationDisplay>
        <NavigationDisplay onClick={routeToProfilePage}>Profile</NavigationDisplay>
        <SearchInput type="text" placeholder="Search" value={searchInput} onChange={handleSearchInputChange}/>
        <button onClick={search}style={smallerButtonStyle}>Search</button>
      </Container>
      
    );
  }