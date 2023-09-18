import React from 'react';
import './App.css';
import {getAnalytics} from "firebase/analytics";
import { app } from "./firebase-config/firebase";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";  
//import LoginPage from "./Pages/LoginPage";
import ProfilePage from "./Pages/ProfilePage.js";
import LoginPage from "./Pages/LoginPage.js";


//INITIALIZE FIREBASE
const analytics = getAnalytics(app);

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path = "/profilePage" component = {<ProfilePage/>} />
          <Route path = "/loginPage" component = {<LoginPage/>} />
          <Route path = "*" element = {<ProfilePage/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;