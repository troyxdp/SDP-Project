import { NavigationBar } from "../components/NavigationBar";
import Sidebar from "../MessageComponents/Sidebar";
import Chat from "../MessageComponents/Chat";
import styled from "styled-components";

const PageContainer = styled.div`
    position: fixed;
    top: 40px;
    left: 40px;
    right: 40px;
    bottom: 40px;
    overflow-y: auto;
    border-radius: 10px;
`;


const MessagesPage = () => {
    const userEmail = sessionStorage.getItem("userEmail");
    
    return (
      <PageContainer>
        <NavigationBar/>
        <div className='messagePage'>
          <div className="container">
            <Sidebar/>
            <Chat/>
          </div>
        </div>
      </PageContainer>
    )
}

export default MessagesPage;

