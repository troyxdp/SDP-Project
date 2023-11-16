import React from 'react';
import './App.css';
import {getAnalytics} from "firebase/analytics";
import { app } from "./firebase-config/firebase";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom"; 
import { Global, css } from '@emotion/react';

import Music_Festival_At_Night_Red_Lights from "./Backgrounds/Music-Festival-At-Night-Red-Lights.jpg";

import ProfilePage from "./Pages/ProfilePage";
import LoginPage from "./Pages/LoginPage";
import RegistrationPage from './Pages/RegistrationPage';
import DetailsPage from './Pages/DetailsPage';
import CreateEventPage from './Pages/CreateEventPage';
import CreateGroupPage from './Pages/CreateGroupPage';
import RequestsPage from './Pages/RequestsPage';
import MessagesPage from './Pages/MessagesPage';
import ConnectionsPage from './Pages/ConnectionsPage';
import EditPersonalDetailsPage from './Pages/EditPersonalDetailsPage';
import EditGroupsDetailsPage from './Pages/EditGroupsDetailsPage';
import EditUpcomingEventsDetailsPage from './Pages/EditUpcomingEventsDetailsPage';
import NotificationsPage from './Pages/NotificationsPage';

//INITIALIZE FIREBASE
const analytics = getAnalytics(app);

const GlobalStyles = () => ( 
  <Global 
      styles={css` 
    body { 
      margin: 0; 
      padding: 0; 
      background-color: #ffffff; 
      font-family: 'Roboto', sans-serif; 
      color: #333; 
      background: #000;
      background-image: url("https://siam2nite.media/xrLsvq1ucq7-cZNSHObsnU5VQQA=/1280x853/smart/pictures/17048/meta_b57099aea9e272b9bfd1fdd34c55944f.jpg");
    } 
  `} 
  /> 
);

function App() {
  return (
    <>
      <GlobalStyles />
      <Router>
        <Routes>
          <Route path = "/profilePage" element = {<ProfilePage/>} />
          <Route path = "/loginPage" element = {<LoginPage/>} />
          <Route path = "/registrationPage" element = {<RegistrationPage/>} />
          <Route path = "/detailsPage" element = {<DetailsPage/>} />
          <Route path = "/createEventPage" element = {<CreateEventPage/>} />
          <Route path = "/createGroupPage" element = {<CreateGroupPage/>} />
          <Route path = "/requestsPage" element = {<RequestsPage/>} />
          <Route path = "/messagesPage" element = {<MessagesPage/>} />
          <Route path = "/connectionsPage" element = {<ConnectionsPage/>} />
          <Route path = "/editPersonalDetailsPage" element = {<EditPersonalDetailsPage/>} />
          <Route path = "/editGroupDetailsPage" element = {<EditGroupsDetailsPage/>} />
          <Route path = "/editUpcomingEventDetailsPage" element = {<EditUpcomingEventsDetailsPage/>} />
          <Route path = "/notificationsPage" element = {<NotificationsPage/>} />
          <Route path = "*" element = {<LoginPage/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;