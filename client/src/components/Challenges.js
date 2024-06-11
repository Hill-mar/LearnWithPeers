import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Challenges.css'; // Adjust the path as necessary

function Challenges() {
    const [challenges, setChallenges] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const BACKEND_URL= process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        fetch(`https://learn-with-peers-backend.vercel.app/api/challenges`)
            .then(response => response.json())
            .then(data => {
                setChallenges(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching challenges:', error);
                setError('Failed to fetch challenges');
                setIsLoading(false);
            });
    }, []);

    if (isLoading) return <p>Loading challenges...</p>;
    if (error) return <p>{error}</p>;
    if (!challenges.length) return <p>No challenges found.</p>;

    return (
        <div className="challenges-container">
            {challenges.map((challenge) => (
                <div key={challenge._id} className="challenge-card" data-status={challenge.status}>
                    <h3>Title: {challenge.title}</h3>
                    <p>Description: {challenge.description}</p>
                    <p>Created by: {challenge.createdBy || 'Unknown'}</p>  
                    <p>Date: {new Date(challenge.createdAt).toLocaleDateString()}</p>
                    <p>Status: {challenge.status}</p>
                    {challenge.status !== 'Attempted' && (
                        <Link to={`/attempt/${challenge._id}`}>Attempt Challenge</Link>
                    )}
                </div>
            ))}
        </div>
    );
}

export default Challenges;
