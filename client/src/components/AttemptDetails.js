import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactPlayerWrapper from './ReactPlayerWrapper';
import StarRating from './StarRating';
import '../styles/AttemptDetails.css';
import { useUser } from '../context/UserContext';


function AttemptDetails() {
    const { attemptId } = useParams();
    const [attempt, setAttempt] = useState(null);
    const [responses, setResponses] = useState({});
    const [loading, setLoading] = useState(true);
    const { user } = useUser();
    const BACKEND_URL= process.env.BACKEND_URL;

    // State for rubric ratings
    const [rubric, setRubric] = useState({
        codeQuality: 0,
        functionality: 0,
        readability: 0,
    });

    useEffect(() => {
        const url = `${BACKEND_URL}/api/attempts/${attemptId}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const fixedVideoUrl = `${BACKEND_URL}/${data.videoUrl.replace(/\\/g, '/')}`;
                data.videoUrl = fixedVideoUrl;
                setAttempt(data);
                setLoading(false);
            })
            .catch(error => console.error('Failed to fetch attempt details:', error));
    }, [attemptId]);

    const handleResponseChange = (index, value) => {
        setResponses(prevResponses => ({
            ...prevResponses,
            [index]: value
        }));
    };

    const handleRubricChange = (name, value) => {
        setRubric(prevRubric => ({
            ...prevRubric,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        const feedbacks = attempt.questions.map((question, index) => ({
            question, // Ensure the question field is included
            response: responses[index] || ''
        }));

        // Calculate the total score and scale it to a rating out of 5
        const totalScore = rubric.codeQuality + rubric.functionality + rubric.readability;
        const scaledRating = (totalScore / 15) * 5;

        fetch(`${BACKEND_URL}/api/reviews/send-reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                attemptId,
                reviewerId: user.username,
                feedbacks,
                rubric, // Include rubric ratings in the request
                scaledRating // Include the scaled rating
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Review submitted:', data);
            alert('Review submitted successfully!');
            setAttempt(prevAttempt => ({
                ...prevAttempt,
                status: 'Reviewed'
            }));
        })
        .catch(error => {
            console.error('Failed to submit review:', error);
            alert('Failed to submit review');
        });
    };

    if (loading) return <p>Loading attempt details...</p>;
    if (!attempt) return <p>No attempt found.</p>;

    return (
        <div className="review-container">
            <div className="attempt-main-content">
                <ReactPlayerWrapper url={attempt.videoUrl} />
                <div className="code-review-container">
                    <div className="code-review">
                        <h2>Code Review</h2>
                        <pre>{attempt.code}</pre>
                    </div>
                    <div className="rrubric-container">
                        <h2>Rate This Attempt</h2>
                        <div className="rubric-item">
                            <label>Code Quality: </label>
                            <StarRating
                                rating={rubric.codeQuality}
                                setRating={(value) => handleRubricChange('codeQuality', value)}
                            />
                        </div>
                        <div className="rubric-item">
                            <label>Functionality: </label>
                            <StarRating
                                rating={rubric.functionality}
                                setRating={(value) => handleRubricChange('functionality', value)}
                            />
                        </div>
                        <div className="rubric-item">
                            <label>Readability: </label>
                            <StarRating
                                rating={rubric.readability}
                                setRating={(value) => handleRubricChange('readability', value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="prompts-container">
                {attempt.questions.map((question, index) => (
                    <div key={index} className="prompt">
                        <p>{question}</p>
                        <textarea
                            value={responses[index] || ''}
                            onChange={(e) => handleResponseChange(index, e.target.value)}
                        />
                    </div>
                ))}
            </div>
            <button className='a_submit-button' onClick={handleSubmit}>Submit Review</button>
        </div>
    );
}

export default AttemptDetails;
