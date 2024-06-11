import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/ReviewDetail.css'; // Ensure you have this CSS for styling
// import io from 'socket.io-client';
import LiveChat from './LiveChat'; // Import the LiveChat component
import ReadOnlyStarRating from './ReadOnlyStarRating'; // Import the ReadOnlyStarRating component
import ReviewRatingForm from './ReviewRating'; // Import the ReviewRatingForm component
const BACKEND_URL= process.env.REACT_APP_BACKEND_URL;
// const socket = io(`${BACKEND_URL}`); // Adjust the URL if necessary

const ReviewDetail = () => {
    const { reviewId } = useParams();
    const [review, setReview] = useState(null);
    const [onlineStatus, setOnlineStatus] = useState({});
    const [liveChatRequested, setLiveChatRequested] = useState(false);

    useEffect(() => {
        fetch(`${BACKEND_URL}/api/reviews/${reviewId}`)
            .then(response => response.json())
            .then(data => {
                console.log("Data received:", data);
                setReview(data);
            })
            .catch(error => console.error('Error fetching review details:', error));

        // Listen for online status updates
        // socket.on('updateUserStatus', ({ username, status }) => {
        //     setOnlineStatus(prevStatus => ({ ...prevStatus, [username]: status }));
        // });

        // Cleanup on component unmount
        // return () => {
        //     socket.off('updateUserStatus');
        // };
    }, [reviewId]);

    const requestLiveChat = () => {
        setLiveChatRequested(true);
        // socket.emit('requestLiveChat', { reviewerId: review.reviewerId, attemptId: review.attemptId._id });
    };

    const handleReviewRatingSubmit = (ratings) => {
        fetch(`${BACKEND_URL}/api/reviews/rate-review/${reviewId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ratings)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Review rating submitted:', data);
            alert('Review rating submitted successfully!');
        })
        .catch(error => {
            console.error('Failed to submit review rating:', error);
            alert('Failed to submit review rating');
        });
    };

    if (!review) return <p>Loading review details...</p>;

    return (
        <div className="review-detail-container">
            <div className="reviewer-status">
                <span className={`status-indicator ${onlineStatus[review.reviewerId] === 'online' ? 'online' : 'offline'}`}></span>
                <span className={`status-text ${onlineStatus[review.reviewerId] === 'online' ? 'online' : 'offline'}`}>
                    Reviewer: {onlineStatus[review.reviewerId] === 'online' ? 'Online' : 'Offline'}
                </span>
                {onlineStatus[review.reviewerId] === 'online' && !liveChatRequested && (
                    <button onClick={requestLiveChat} className="request-live-chat-button">Request Live Chat</button>
                )}
            </div>
            <div className="content-container">
                <div className="left-side">
                    <div className="code-viewer">
                        <pre>{review.attemptId.code}</pre>
                    </div>
                    <div className="rubric-container">
                        <div className="rubric-left">
                            <h3>Code Ratings</h3>
                            <div className="rubric-item">
                                <label>Code Quality: </label>
                                <ReadOnlyStarRating rating={review.rubric.codeQuality} />
                            </div>
                            <div className="rubric-item">
                                <label>Functionality: </label>
                                <ReadOnlyStarRating rating={review.rubric.functionality} />
                            </div>
                            <div className="rubric-item">
                                <label>Readability: </label>
                                <ReadOnlyStarRating rating={review.rubric.readability} />
                            </div>
                        </div>
                       
                    </div>
                </div>
                <div className="right-side">
                    <div className="responses-container">
                        <h3>Responses</h3>
                        {review.feedbacks.map((feedback, index) => (
                            <div key={index} className="response">
                                <h4>{feedback.question}</h4>
                                <p>{feedback.response}</p>
                            </div>
                        ))}
                    </div>
                    <div className="rubric-right">
                            <ReviewRatingForm onSubmit={handleReviewRatingSubmit} />
                        </div>
                </div>
            </div>
            {liveChatRequested && <LiveChat attemptId={review.attemptId._id} />}
        </div>
    );
};

export default ReviewDetail;
