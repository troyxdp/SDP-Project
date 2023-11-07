import React, { Children, useContext, useEffect, useState } from 'react';
import { db } from '../firebase-config/firebase';
import { getDoc, doc } from 'firebase/firestore';
import './styles.css';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  // Use state to store user data

  const email = sessionStorage.getItem('userEmail')

  const [user, setUser] = useState({
    email: email,
    fullName: '', // Initialize with static data
    profilePic: ''
  });

  // Simulate a delay to demonstrate useEffect
  useEffect(() => {
    const fetchData = async () => {
      
      const docRef = doc(db, 'users', email);
      const docSnap = await getDoc(docRef);

      setUser({
        email: email,
        fullName: docSnap.data().fullName,
        profilePic: docSnap.data().profilePic
      });
    }
    fetchData();
  }, []);

  return (
    <div className='navbar'>
      <span className='logo'>Messenger</span>
      <div className='user'>
        {/* <img src={currentUser.photoURL} alt="" /> */}
        <span>{user.fullName}</span> {/* Display the user's full name */}
      </div>
    </div>
  );
};

export default Navbar;
