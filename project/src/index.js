import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AuthContextProvider } from './context/AuthContext'; // Import the AuthContextProvider
import { ChatContextProvider } from './context/ChatContext';


ReactDOM.render(
  <AuthContextProvider>
    <ChatContextProvider>
      <App />
    </ChatContextProvider>
  </AuthContextProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
