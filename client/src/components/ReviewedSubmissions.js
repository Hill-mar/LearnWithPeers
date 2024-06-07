// src/components/ReviewedSubmissions.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ReviewedSubmissions.css'; // Ensure you have this CSS for styling
import { useUser } from '../context/UserContext'; // Import the UserContext
import io from 'socket.io-client';
const BACKEND_URL= process.env.BACKEND_URL;

const socket = io(`${BACKEND_URL}`); // Adjust the URL if necessary

const ReviewedSubmissions = () => {
  const [reviews, setReviews] = useState([]);
  const [onlineStatus, setOnlineStatus] = useState({});
  const { user } = useUser(); // Get the logged-in user's information

  useEffect(() => {
    if (user && user.username) {
      fetch(`${BACKEND_URL}/api/reviews/get-user-reviews/${user.username}`)
        .then(response => response.json())
        .then(data => {
          console.log('Fetched reviews:', data); // Log the fetched data
          setReviews(data);
        })
        .catch(error => console.error('Error fetching reviews:', error));
    }

    // Listen for online status updates
    socket.on('updateUserStatus', ({ username, status }) => {
      setOnlineStatus(prevStatus => ({ ...prevStatus, [username]: status }));
    });

    // Notify server that the user is online
    socket.emit('userOnline', user.username);

    // Cleanup on component unmount
    return () => {
      socket.off('updateUserStatus');
    };
  }, [user.username]);

  return (
    <div className="reviews-container">
      {reviews.map(review => (
        <div key={review._id} className="review-card">
          <h3>{review.attemptId?.challengeId?.title}</h3>
          <p>Created by: {review.attemptId?.challengeId?.createdBy}</p>
          <p>Attempted by: {review.attemptId?.username}</p>
          <p>Reviewed by: {review.reviewerId}</p>
          <p>Date Reviewed: {new Date(review.createdAt).toLocaleDateString()}</p>
          <div className="subreviewer-status">
            <span className={`substatus-indicator ${onlineStatus[review.reviewerId] === 'online' ? 'online' : 'offline'}`}></span>
            <span className={`substatus-text ${onlineStatus[review.reviewerId] === 'online' ? 'online' : 'offline'}`}>
              Reviewer: {onlineStatus[review.reviewerId] === 'online' ? 'Online' : 'Offline'}
            </span>
          </div>
          <Link to={`/review-detail/${review._id}`}>Check Review</Link>
          <div className="scaled-rating">
            <span> Reviewer Rating: {review.scaledRating.toFixed(2)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewedSubmissions;
