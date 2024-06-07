// src/components/ReviewFeedback.js
import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import '../styles/ReviewFeedback.css'; // Ensure you create this CSS file

const ReviewFeedback = () => {
    const { user } = useUser();
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            console.log('User:', user); // Debug log
            fetch('https://server-rgjzels57-hilmar-chesters-projects.vercel.app/api/reviews/review-feedback')
                .then(response => response.json())
                .then(data => {
                    console.log('Fetched data:', data); // Debug log
                    if (Array.isArray(data)) {
                        const filteredFeedbacks = data.filter(feedback => feedback.reviewerId === user.username);
                        console.log('Filtered feedbacks:', filteredFeedbacks); // Debug log
                        setFeedbacks(filteredFeedbacks);
                    } else {
                        console.error('Fetched data is not an array:', data);
                    }
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching review feedback:', error);
                    setLoading(false);
                });
        }
    }, [user]);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="review-feedback-container">
            {feedbacks.length > 0 ? (
                feedbacks.map(feedback => (
                    <div key={feedback._id} className="feedback-card">
                        <h3>Title: {feedback.attemptId.challengeId.title}</h3>
                        <p><strong>User:</strong> {feedback.reviewerId}</p>
                        <p><strong>Date Reviewed:</strong> {new Date(feedback.createdAt).toLocaleDateString()}</p>
                        <h3>User Feedback</h3>
                        <div className="rubrics">
                            <p><strong>Clarity:</strong> {feedback.reviewFeedbackRubric.clarity}</p>
                            <p><strong>Helpfulness:</strong> {feedback.reviewFeedbackRubric.helpfulness}</p>
                            <p><strong>Timeliness:</strong> {feedback.reviewFeedbackRubric.timeliness}</p>
                        </div>
                        <p className="scaled-rating"><strong> Feedback Score:</strong> {feedback.reviewFeedbackScaledRating}</p>
                    </div>
                ))
            ) : (
                <p>No feedbacks available.</p>
            )}
        </div>
    );
};

export default ReviewFeedback;
