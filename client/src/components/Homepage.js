import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Homepage.css'; // Ensure this CSS file is created for styling

function Homepage() {
  return (
    <div className="homepage">
      <div className="overlay">
        <h1>Welcome to LearnWithPeers</h1>
        <p>Join Your Friends to enhance your coding skills through peer reviews and collaborative learning.</p>
        <div className="homepage-links">
          <Link to="/login" className="btn">Login</Link>
          <Link to="/register" className="btn">Register</Link>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
