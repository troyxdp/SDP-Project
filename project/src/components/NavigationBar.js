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

export function NavigationBar() {
    let userEmail = sessionStorage.getItem("userEmail");

    //functions to take user to whichever page they desire
    let navigate = useNavigate();
    const routeToProfilePage = async (e) => {
        e.preventDefault();
        navigate("/profilePage", {state : userEmail});
    }
    const routeToConnectionsPage = async (e) => {
        e.preventDefault();
        navigate("/connectionsPage");
    }
    const routeToMessagesPage = async (e) => {
        e.preventDefault();
        navigate("/messagesPage");
    }
    const routeToRequestsPage = async (e) => {
        e.preventDefault();
        navigate("/requestsPage");
    }

    return(
        <Container>
            <NavigationDisplay onClick={routeToConnectionsPage}>
                Connections
            </NavigationDisplay>
            <NavigationDisplay onClick={routeToMessagesPage}>
                Messages
            </NavigationDisplay>
            <NavigationDisplay onClick={routeToRequestsPage}>
                Requests
            </NavigationDisplay>
            <NavigationDisplay onClick={routeToProfilePage}>
                Profile
            </NavigationDisplay >
        </Container>
    );
}