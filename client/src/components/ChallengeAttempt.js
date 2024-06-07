import React, { useState, useEffect } from 'react';
import Editor from "@monaco-editor/react";
import { useParams, useNavigate } from 'react-router-dom';
import RecordRTC from 'recordrtc';
import { useUser } from '../context/UserContext';
import ReviewerModal from './ReviewerModal'; // Import the modal component
import '../styles/ChallengeAttempt.css';

function ChallengeAttempt() {
    const { challengeId } = useParams();
    const navigate = useNavigate();
    const [code, setCode] = useState('// Start coding your challenge here');
    const [loading, setLoading] = useState(true);
    const [challenge, setChallenge] = useState(null);
    const [submissionMessage, setSubmissionMessage] = useState('');
    const [recorder, setRecorder] = useState(null);
    const [videoBlob, setVideoBlob] = useState(null);
    const [stream, setStream] = useState(null);
    const [users, setUsers] = useState([]);
    const [selectedReviewer, setSelectedReviewer] = useState('');
    const [questions, setQuestions] = useState([]);
    const [showReviewerModal, setShowReviewerModal] = useState(false);
    const { user } = useUser();
    const BACKEND_URL= process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        fetch(`${BACKEND_URL}/api/challenges/${challengeId}`)
            .then(response => response.json())
            .then(data => {
                setChallenge(data);
                setCode(data.starterCode || '// Start coding your challenge here');
                setLoading(false);
            })
            .catch(error => {
                console.error('Failed to fetch challenge details:', error);
                setLoading(false);
            });

        fetch(`${BACKEND_URL}/api/users/get-users`)
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Failed to fetch users:', error));
    }, [challengeId]);

    const handleEditorChange = (value) => {
        setCode(value);
    };

    const startRecording = () => {
        navigator.mediaDevices.getDisplayMedia({ video: true }).then(stream => {
            const recordRTC = new RecordRTC(stream, { type: 'video' });
            recordRTC.startRecording();
            setRecorder(recordRTC);
            setStream(stream);
        }).catch(error => {
            console.error("Error accessing media devices:", error);
        });
    };

    const stopRecording = () => {
        if (recorder) {
            recorder.stopRecording(() => {
                const blob = recorder.getBlob();
                setVideoBlob(blob);
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                    setStream(null);
                }
                setRecorder(null);
            });
        } else {
            console.error("Recorder not initialized.");
        }
    };

    const handleVideoUpload = async (videoBlob) => {
        const formData = new FormData();
        formData.append('video', videoBlob, 'filename.webm');

        const uploadResponse = await fetch(`${BACKEND_URL}/api/attempts/upload-video`, {
            method: 'POST',
            body: formData,
        });

        if (uploadResponse.ok) {
            const uploadResult = await uploadResponse.json();
            return uploadResult.path;
        } else {
            throw new Error('Failed to upload video');
        }
    };

    const handleSubmitAttempt = async () => {
        if (!selectedReviewer) {
            setSubmissionMessage('Please select a reviewer.');
            return;
        }

        try {
            const videoPath = await handleVideoUpload(videoBlob);

            const attemptResponse = await fetch(`${BACKEND_URL}/api/attempts/send-attempts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    challengeId,
                    code,
                    username: user.username,
                    videoUrl: videoPath,
                    reviewer: selectedReviewer,
                    questions // Include the custom questions
                }),
            });

            if (attemptResponse.ok) {
                setSubmissionMessage(`${selectedReviewer} has been notified. Redirecting to the Dashboard...`);
                setShowReviewerModal(false); // Close the modal

                // Redirect to the Dashboard after 3 seconds
                setTimeout(() => {
                    navigate('/dashboard');
                }, 3000);
            } else {
                const errorData = await attemptResponse.json();
                setSubmissionMessage(`Failed to submit your attempt: ${errorData.message}`);
            }
        } catch (error) {
            setSubmissionMessage(`Error: ${error.message}`);
        }
    };

    useEffect(() => {
        if (selectedReviewer && questions.length > 0) {
            handleSubmitAttempt();
        }
    }, [selectedReviewer, questions]);

    const handleSelectReviewer = (username, questions) => {
        setSelectedReviewer(username);
        setQuestions(questions);
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="attemptcontainer">
            <div className="editor-container">
                <Editor
                    height="70vh"
                    width="100%"
                    language="javascript"
                    theme="vs-dark"
                    value={code}
                    onChange={handleEditorChange}
                />
                <button className='start-button' onClick={startRecording}>Start</button>
                <button className='stop-button' onClick={stopRecording}>Stop</button>
                {videoBlob && (
                    <button className="submit-button" onClick={() => setShowReviewerModal(true)}>Submit Attempt</button>
                )}
                {submissionMessage && <p className="message">{submissionMessage}</p>}
            </div>
            <div className="details-container">
                <h1>Challenge Title: {challenge?.title}</h1>
                {challenge && <img src={`${BACKEND_URL}/api/challenges/${challengeId}/photo`} alt="Challenge" className="challenge-image" />}
                <div className="details-text">
                    <p>Created by: {challenge?.createdBy}</p>
                    <p>Description: {challenge?.description}</p>
                </div>
            </div>

            <ReviewerModal
                isOpen={showReviewerModal}
                users={users}
                onSelectReviewer={handleSelectReviewer}
                onClose={() => setShowReviewerModal(false)}
            />
        </div>
    );
}

export default ChallengeAttempt;
