import React, { useEffect, useState } from 'react';
import './styles.css';

const Navbar = () => {
  // Use state to store user data
  const [user, setUser] = useState({
    email: 'demo@example.com',
    fullName: 'John Doe', // Initialize with static data
  });

  // Simulate a delay to demonstrate useEffect
  useEffect(() => {
    const fetchData = async () => {
      // Simulate an API call
      setTimeout(() => {
        const userData = {
          email: 'user@example.com', // Replace with actual user data
          fullName: 'Alice Johnson', // Replace with actual user data
        };
        setUser(userData);
      }, 2000); // Simulate a 2-second delay
    };
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
