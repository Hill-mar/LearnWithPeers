import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext'; // Import the user context
import '../styles/ViewAttempts.css'; // Import the new CSS file

function ViewAttempts() {
    const { user } = useUser(); // Get the logged-in user
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const BACKEND_URL= process.env.BACKEND_URL;

    useEffect(() => {
        if (user && user.username) {
            fetch(`${BACKEND_URL}/api/attempts/view-attempts/${user.username}`) // Adjust this URL to your API endpoint for fetching attempts
               .then(response => response.json())
               .then(data => {
                    console.log("Data from API:", data);  // Check the data here
                    setAttempts(data);
                    setLoading(false);
                })
               .catch(error => {
                    console.error('Failed to fetch attempts:', error);
                    setLoading(false);
                });
        }
    }, [user]);

    if (loading) return <p>Loading submissions...</p>;

    return (
        <div className="attempts-container">
            {attempts.map((attempt) => (
                <div key={attempt._id} className="attempt-card" data-status={attempt.status}>
                    <h3>Title: {attempt.challengeId?.title}</h3>  
                    <p>Description: {attempt.challengeId?.description}</p>
                    <p>Created by: {attempt.challengeId?.createdBy}</p>
                    <p>Attempted by: {attempt.username}</p>                   
                    <p>Date: {new Date(attempt.createdAt).toLocaleDateString()}</p>
                    {/* Conditionally render the "Review Attempt" link */}
                    {attempt.status === 'To be Reviewed' && (
                        <Link to={`/attempt-details/${attempt._id}`}>Review Attempt</Link>
                    )}
                </div>
            ))}
        </div>
    );
}

export default ViewAttempts;
