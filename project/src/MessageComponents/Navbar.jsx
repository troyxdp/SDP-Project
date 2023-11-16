import React, { useContext } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase-config/firebase';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className='navbar'>
      <span className="logo">MingleNGroove</span>
      {currentUser ? (
        <div className="user">
          {currentUser.photoURL && <img src={currentUser.photoURL} alt="" />}
          <span>{currentUser.displayName}</span>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default Navbar;
