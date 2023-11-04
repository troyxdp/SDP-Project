// import { NavigationBar } from "../components/NavigationBar";
// import styled from "styled-components";
// import React, { useState, useEffect } from 'react';
// import SendMessage from './SendMessage'; // Check the path to the 'SendMessage' component
// import { collection, query, limit, orderBy, onSnapshot } from "firebase/firestore";
// import MessagesPage from './MessagesPage';

// const Container = styled.div`
//   display: grid;
//   grid-template-columns: 1fr 0.5fr; /* Three columns: two flexible and one 200px wide */
//   height: 100vh;
// `;
// const StyledHeader = styled.h1`
//   font-size: 1.8rem;
//   font-weight: bold;
//   margin-top: 0px;
//   margin-bottom: 8px;
// `;

// function Chat() {
//     const [messages, setMessages] = useState([])
//     const { userID } = auth.currentUser
  

//   useEffect(() => {
//         const q = query(
//           collection(db, "messages"),
//           orderBy("createdAt"),
//           limit(50)
//         );
//         const data = onSnapshot(q, (QuerySnapshot) => {
//               let messages = [];
//               QuerySnapshot.forEach((doc) => {
//                 messages.push({ ...doc.data(), id: doc.id });
//               });
//               setMessages(messages) 
          
//         });
//         return () => data; 
   
//   }, []);
 
//     return (
//            <div>
//              <button onClick={() => auth.signOut()}>Sign Out</button>
//               {messages && messages.map((message, id, uid, photoURL) => 
//                  <div 
//                key={id} 
//                className={`msg ${userID === auth.currentUser.uid ? 'sent' : 'received'}`}>
//                   <img src={message.photoURL} />
//                   <p>{message.text}</p>
//                </div>
//               )} 
//            <SendMessage />
//          </div>
//     )
// }

// export default MessagesPage;