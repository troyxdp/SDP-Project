import {NavigationBar} from "../components/NavigationBar";
import styled from "styled-components";
import Sidebar from '../MesssageComponents/Sidebar'
import Chat from '../MesssageComponents/Chat'

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 0.5fr; /* Three columns: two flexible and one 200px wide */
  height: 100vh;
`;

const Container1 = styled.div`
  display: grid;
  grid-template-columns: 1fr 0.5fr; /* Three columns: two flexible and one 200px wide */
  height: 100vh;
  margin-top: 10px;
`;
const StyledHeader = styled.h1`
  font-size: 1.8rem;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 8px;
`;

const MessagesPage = () => {
    const userEmail = sessionStorage.getItem("userEmail");
    
    return (
      <>
      <NavigationBar/>
      <div> </div>
      <div className='home'>
        <Container1 className="container">
          <Sidebar/>
          <Chat/>
        </Container1>
      </div>
      </>
    )
}

export default MessagesPage;

