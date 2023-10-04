import React from 'react';
import './App.css';
import {getAnalytics} from "firebase/analytics";
import { app } from "./firebase-config/firebase";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";  
//import LoginPage from "./Pages/LoginPage";
import ProfilePage from "./Pages/ProfilePage.js";
import LoginPage from "./Pages/LoginPage.js";
import RegistrationPage from './Pages/RegistrationPage';
import DetailsPage from './Pages/DetailsPage';


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
          <Route path = "*" element = {<LoginPage/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;