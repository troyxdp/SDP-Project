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
          <Route path = "*" element = {<LoginPage/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;