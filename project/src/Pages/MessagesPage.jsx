import { NavigationBar } from "../components/NavigationBar";
import Sidebar from "../MessageComponents/Sidebar";
import Chat from "../MessageComponents/Chat";


const MessagesPage = () => {
    const userEmail = sessionStorage.getItem("userEmail");
    
    return (
      <>
      <NavigationBar/>
      <div className='messagePage'>
        <div className="container">
          <Sidebar/>
          <Chat/>
        </div>
      </div>
      </>
    )
}

export default MessagesPage;

