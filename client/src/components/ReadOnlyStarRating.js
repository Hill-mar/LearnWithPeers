// src/components/ReadOnlyStarRating.js
import React from 'react';
import '../styles/StarRating.css';
import '../styles/ReadOnlyStarRating.css';
const ReadOnlyStarRating = ({ rating }) => {
    return (
        <div className="star-rating">
            {[...Array(5)].map((star, index) => {
                index += 1;
                return (
                    <span
                        key={index}
                        className={index <= rating ? "on" : "off"}
                    >
                        <i className="fa-solid fa-star"></i>
                    </span>
                );
            })}
        </div>
    );
};

export default ReadOnlyStarRating;
