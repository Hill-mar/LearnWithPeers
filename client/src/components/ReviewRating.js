// src/components/ReviewRatingForm.js
import React, { useState } from 'react';
import StarRating from './StarRating'; // Reuse the existing StarRating component
import '../styles/ReviewRating.css'; // Ensure you have this CSS for styling


const ReviewRatingForm = ({ onSubmit }) => {
    const [ratings, setRatings] = useState({
        clarity: 0,
        helpfulness: 0,
        timeliness: 0,
    });

    const handleRatingChange = (name, value) => {
        setRatings(prevRatings => ({
            ...prevRatings,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(ratings);
    };

    return (
        <form onSubmit={handleSubmit} className="review-rating-form">
            <h3>Rate This Review</h3>
            <div className="rubric-item">
                <label>Clarity: </label>
                <StarRating
                    rating={ratings.clarity}
                    setRating={(value) => handleRatingChange('clarity', value)}
                />
            </div>
            <div className="rubric-item">
                <label>Helpfulness: </label>
                <StarRating
                    rating={ratings.helpfulness}
                    setRating={(value) => handleRatingChange('helpfulness', value)}
                />
            </div>
            <div className="rubric-item">
                <label>Timeliness: </label>
                <StarRating
                    rating={ratings.timeliness}
                    setRating={(value) => handleRatingChange('timeliness', value)}
                />
            </div>
            <button type="submit" className="submit-rating-button">Submit Rating</button>
        </form>
    );
};

export default ReviewRatingForm;
