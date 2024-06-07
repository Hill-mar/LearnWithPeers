// src/components/StarRating.js
import React from 'react';
import '../styles/StarRating.css';

const StarRating = ({ rating, setRating }) => {
    return (
        <div className="star-rating">
            {[...Array(5)].map((star, index) => {
                index += 1;
                return (
                    <button
                        type="button"
                        key={index}
                        className={index <= rating ? "on" : "off"}
                        onClick={() => setRating(index)}
                    >
                        <i class="fa-solid fa-star"></i>
                    </button>
                );
            })}
        </div>
    );
};

export default StarRating;
