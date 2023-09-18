import React from 'react';
import './App.css';

function App() {
  return (
    <div className="container">
      <div className="horizontal-panels">
        <div className="top-panel">
          <header className="header">
        <h1>Profile Page</h1>
        <div className="profile-info">
          <img
            src="your-profile-image-url.jpg"
            alt="Profile"
            className="profile-image"
          />
          <div className="profile-details">
            <h2>Your Name</h2>
            <p>Bio</p>
            <p>Email: your@email.com</p>
            <p>Location: Your City, Country</p>
            {/* Add more profile information as needed */}
          </div>
        </div>
      </header>
        </div>
        <div className="bottom-panel">
        <div className="tabs">
            <button>Tab 1</button>
            <button>Tab 2</button>
            <button>Tab 3</button>
            <button>Tab 4</button>
            <button>Tab 5</button>
          </div>
          {/* Content for the active tab */}
        </div>
      </div>
      <div className="vertical-panel">
    <header className='header'>
      <h1>Reviews</h1>
      </header>
        {/* Content for the vertical panel on the right */}
      </div>
    </div>
  );
}

export default App;
