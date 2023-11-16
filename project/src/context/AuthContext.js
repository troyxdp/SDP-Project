import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth"; // Import `onAuthStateChanged` from "firebase/auth"
import { auth } from "../firebase-config/firebase";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []); // Pass an empty dependency array to ensure the effect runs only once

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
