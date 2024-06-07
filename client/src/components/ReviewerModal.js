import React, { useState } from 'react';
import Modal from 'react-modal';
import '../styles/ReviewerModal.css'; // Ensure the CSS file is created and styled

Modal.setAppElement('#root'); // Set the root element for accessibility

const ReviewerModal = ({ isOpen, users, onSelectReviewer, onClose }) => {
    const [selectedUser, setSelectedUser] = useState('');
    const [step, setStep] = useState(1); // Step 1: Select Reviewer, Step 2: Enter Questions
    const [questions, setQuestions] = useState(['', '', '']);

    const handleConfirmReviewer = () => {
        if (selectedUser) {
            setStep(2); // Move to the next step
        }
    };

    const handleQuestionChange = (index, value) => {
        const newQuestions = [...questions];
        newQuestions[index] = value;
        setQuestions(newQuestions);
    };

    const handleConfirmQuestions = () => {
        if (questions.every(q => q.trim() !== '')) {
            onSelectReviewer(selectedUser, questions);
            onClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Select Reviewer"
            className="reviewer-modal"
            overlayClassName="reviewer-modal-overlay"
        >
            {step === 1 && (
                <>
                    <h2>Select a Reviewer</h2>
                    <ul className="reviewer-list">
                        {users.length > 0 ? (
                            users.map((user) => (
                                <li
                                    key={user.username}
                                    onClick={() => setSelectedUser(user.username)}
                                    className={selectedUser === user.username ? 'selected' : ''}
                                >
                                    <div>
                                        <strong>{user.username}</strong>
                                        <p>Availability: {user.availability}</p>
                                        <p>Response Time: {user.responseTime}</p>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li>No users available</li>
                        )}
                    </ul>
                    <button onClick={handleConfirmReviewer}>Next</button>
                    <button onClick={onClose}>Cancel</button>
                </>
            )}
            {step === 2 && (
                <>
                    <h2>Questions for the Reviewer</h2>
                    {questions.map((question, index) => (
                        <div key={index} className="question-container">
                            <label>Question {index + 1}</label>
                            <textarea
                                value={question}
                                onChange={(e) => handleQuestionChange(index, e.target.value)}
                                rows="3"
                                cols="50"
                            />
                        </div>
                    ))}
                    <button onClick={handleConfirmQuestions}>Confirm</button>
                    <button onClick={onClose}>Cancel</button>
                </>
            )}
        </Modal>
    );
};

export default ReviewerModal;
