import styled from "styled-components";
import Chat from '../MessageComponents/Chat';
import Sidebar from '../MessageComponents/Sidebar';
import { NavigationBar } from "../components/NavigationBar";

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 0.5fr; /* Three columns: two flexible and one 200px wide */
  height: 98vh;
`;

const Container1 = styled.div`
  display: grid;
  grid-template-columns: 1fr 0.5fr; /* Three columns: two flexible and one 200px wide */
  height: 90vh;
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
        <div className="container">
          <Sidebar/>
          <Chat/>
        </div>
      </div>
      </>
    )
}

export default MessagesPage;

