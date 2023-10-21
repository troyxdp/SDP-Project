import {NavigationBar} from "../components/NavigationBar";
import styled from "styled-components";

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 0.5fr; /* Three columns: two flexible and one 200px wide */
  height: 100vh;
`;
const StyledHeader = styled.h1`
  font-size: 1.8rem;
  font-weight: bold;
  margin-top: 0px;
  margin-bottom: 8px;
`;

const MessagesPage = () => {
    const userEmail = sessionStorage.getItem("userEmail");
    
    return(
        <>
            <NavigationBar/>
            <Container>
                <StyledHeader>Messages</StyledHeader>
            </Container>
        </>
    );
}

export default MessagesPage;