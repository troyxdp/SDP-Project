import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import {NavigationBar} from "../components/NavigationBar";
import Message from "./Message";
import './styles.css';

const Messages = () => {
  // State to store messages
  const [messages, setMessages] = useState([]);
  
  // Get chat data from the context
  const { data } = useContext(ChatContext);

  // Effect to listen to changes in the chat messages
  useEffect(() => {
    // Simulated static data for demonstration
    const staticMessages = [
      { id: 1, text: "Hello!", sender: "user1" },
      { id: 2, text: "Hi there!", sender: "user2" },
      { id: 3, text: "How are you?", sender: "user1" },
      { id: 4, text: "I'm good, thanks!", sender: "user2" },
      // Add your messages here
      { id: 5, text: "This is a message from me!", sender: "user1" },
      { id: 6, text: "And this is my reply.", sender: "user2" },
    ];

    // Set the static messages as the initial state
    setMessages(staticMessages);
  }, []); // Empty dependency array, runs once

  return (
    <><NavigationBar /><div className="messages">
      {messages.map((m) => (
        <Message
          message={m}
          key={m.id}
          isUserMessage={m.sender === "user1"} // Check if the message is from the user
        />
      ))}
    </div></>
  );
};

export default Messages;
