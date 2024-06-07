import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import '../styles/ReviewAttempt.css';


function ReviewAttempt() {
    const { attemptId } = useParams();
    const [attempt, setAttempt] = useState(null);
    const [loading, setLoading] = useState(true);
    const BACKEND_URL= process.env.BACKEND_URL;

    useEffect(() => {
        fetch(`${BACKEND_URL}/api/attempts/${attemptId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (!data) {
                    throw new Error('No data returned from fetch.');
                }
                setAttempt(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Failed to fetch attempt:', error);
                setLoading(false);
            });
    }, [attemptId]);

    

    return (
        <div className="review-container">
            <div>
                <h1>Review Attempt</h1>
                <video width="720" controls>
                    <source src={attempt.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
            <div>
                <pre>{attempt.code}</pre>
                <div>
                    <h2>Review Prompts</h2>
                    <p>Explain the logic behind this code block.</p>
                    <textarea />
                    <p>Describe the purpose of this function and how it contributes to the overall solution.</p>
                    <textarea />
                    <p>Identify any potential areas for improvement and explain alternative approaches.</p>
                    <textarea />
                    <p>Rate the clarity and efficiency of the code.</p>
                    <textarea />
                </div>
            </div>
        </div>
    );
}

export default ReviewAttempt;