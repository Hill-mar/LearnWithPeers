import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Layout.css'; // Ensure you create this CSS file

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <header className="header">
        <Link to="/">
          <img src="/path/to/learnwithpeers-logo.png" alt="LearnWithPeers Logo" className="logo" />
        </Link>
      </header>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
