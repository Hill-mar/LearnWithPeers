import React, { useContext, useEffect, useState } from 'react';
import { useUser } from '../context/UserContext'; // Adjust the path as necessary
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user } = useUser();
  const [submitted, setSubmitted] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [reviewed, setReviewed] = useState(0); 
  const BACKEND_URL= process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    if (user) {
      fetch(`https://learn-with-peers-backend.vercel.app/api/users/challenge-count/${user.username}`)
        .then(response => response.json())
        .then(data => setSubmitted(data.count))
        .catch(error => console.error('Error fetching challenge count:', error));

      fetch(`${BACKEND_URL}/users/attempt-count/${user.username}`)
        .then(response => response.json())
        .then(data => setAttempted(data.count))
        .catch(error => console.error('Error fetching attempt count:', error));



      fetch(`${BACKEND_URL}/api/users/review-count/${user.username}`)
        .then(response => response.json())
        .then(data => setReviewed(data.count))
        .catch(error => console.error('Error fetching review count:', error));
    }
  }, [user]);

  return (
    <div className="dashboard">
        <div className="welcome-message">
            <h4>Welcome back, {user ? user.username : 'Guest'}!</h4>
        </div>
        <div className="boxes-container">
            <div className="box">
                <h2>{submitted}</h2>
                <p>Challenges Submitted</p>
            </div>
            <div className="box">
                <h2>{attempted}</h2>
                <p>Challenges Attempted</p>
            </div>
            <div className="box">
                <h2>{reviewed}</h2>
                <p>Challenges Reviewed</p>
            </div>
        </div>
    </div>
  );
};

export default Dashboard;
