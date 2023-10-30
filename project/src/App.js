import React from 'react';
import './App.css';
import {getAnalytics} from "firebase/analytics";
import { app } from "./firebase-config/firebase";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom"; 
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

//INITIALIZE FIREBASE
const analytics = getAnalytics(app);

function App() {
  return (
    <>
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
          <Route path = "*" element = {<LoginPage/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;