import {NavigationBar} from "../components/NavigationBar";
import styled from "styled-components";

const PageContainer = styled.div`
    position: fixed;
    top: 40px;
    left: 40px;
    right: 40px;
    bottom: 40px;
    overflow-y: auto;
    background: #fff;
    border-radius: 10px;
`;
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

const RequestsPage = () => {
    const userEmail = sessionStorage.getItem("userEmail");
    
    return(
        <PageContainer>
            <NavigationBar/>
            <Container>
                <StyledHeader>Requests</StyledHeader>
            </Container>
        </PageContainer>
    );
}
export default RequestsPage;