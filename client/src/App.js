import React, { useState } from 'react';
import { UserProvider } from './context/UserContext';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Profile from './components/Profile';
import Homepage from './components/Homepage';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ChallengeSubmission from './components/ChallengeSubmission';
import Challenges from './components/Challenges';
import ChallengeAttempt from './components/ChallengeAttempt';
import RegistrationSuccess from './components/RegistrationSuccess';
import ReviewFeedback from './components/ReviewFeedback';
import '@fortawesome/fontawesome-free/css/all.min.css';

import './App.css';
import DropdownMenu from './components/DropdownMenu';
import ViewAttempts from './components/ViewAttempts';
import ReviewAttempt from './components/ReviewAttempt';
import AttemptDetails from './components/AttemptDetails';
import ReviewedSubmissions from './components/ReviewedSubmissions';
import ReviewDetail from './components/ReviewDetail';

function App() {
  <DropdownMenu />
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();  // Get the current location
  const showSidebar = isLoggedIn && !location.pathname.startsWith('/attempt');  // Condition to determine when to show the sidebar

  return (
    <UserProvider>
      <div className='Top'>
        {isLoggedIn && (
          <div className="app">
            <DropdownMenu />
            {showSidebar && <Sidebar />}
            <div className="main-content">
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/submit-challenge" element={<ChallengeSubmission />} />
                <Route path="/challenges" element={<Challenges />} />
                <Route path="/review-attempt/:attemptId" element={<ReviewAttempt />} />
                <Route path="/attempt/:challengeId" element={<ChallengeAttempt />} />
                <Route path="/view-attempts" element={<ViewAttempts />} />
                <Route path="/attempt-details/:attemptId" element={<AttemptDetails />} />
                <Route path="/reviewed-submissions" element={<ReviewedSubmissions />} />
                <Route path="/review-detail/:reviewId" element={<ReviewDetail />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/review-feedback" element={<ReviewFeedback />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
            </div>
          </div>
        )}
        {!isLoggedIn && (
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/registration-success" element={<RegistrationSuccess />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}
      </div>
    </UserProvider>
  );
}

export default App;
