import React from "react";
import Navbar from "./Navbar"
import Search from "./Search"
import Chats from "./Chats"
import './styles.css';


const Sidebar = () => {
  return (
    <div className="sidebar">
      <Navbar/>
      <Chats/>
    </div>
  );
};

export default Sidebar;