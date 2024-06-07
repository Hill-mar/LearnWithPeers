import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Homepage.css'; // Reuse the homepage CSS

function RegistrationSuccess() {
  return (
    <div className="homepage">
      <div className="overlay">
        <h1>Registration Successful!</h1>
        <p>Your account has been created successfully.</p>
        <div className="homepage-links">
          <Link to="/login" className="btn">Go to Login</Link>
        </div>
      </div>
    </div>
  );
}

export default RegistrationSuccess;
