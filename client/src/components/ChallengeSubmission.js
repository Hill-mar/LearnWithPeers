import React, { useState } from 'react';
import '../styles/ChallengeSubmission.css'; // Adjust the path as necessary
import { useUser } from '../context/UserContext';

function ChallengeSubmission() {
  const { user } = useUser();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState(''); // For user feedback
  const BACKEND_URL= process.env.REACT_APP_BACKEND_URL;

  const handlePhotoChange = (event) => {
    if (event.target.files[0] && event.target.files[0].type.startsWith('image/')) {
      setPhoto(event.target.files[0]);
    } else {
      setMessage('Please upload a valid image file.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('title', name);
    formData.append('description', description);
    formData.append('photo', photo);
    console.log('Created By:', user.username); // Check what ID is being sent
    formData.append('createdBy', user.username); // You need to obtain this from context or session
    

    try {
      const response = await fetch(`${BACKEND_URL}/api/challenges`, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        console.log('Challenge submitted successfully');
        setName('');
        setDescription('');
        setPhoto(null);
        setMessage('Challenge submitted successfully!');
      } else {
        setMessage('Failed to submit challenge. Please try again.');
        console.error('Failed to submit challenge');
      }
    } catch (error) {
      setMessage('Error submitting challenge. Please check your connection.');
      console.error('Error submitting challenge:', error);
    }
  };

  return (
    <div className="challenge-submission">
      <form onSubmit={handleSubmit}>
        <label>
          Challenge Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Description:
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </label>
        <label>
          Upload Photo:
          <input type="file" onChange={handlePhotoChange} accept="image/*" />
        </label>
        <button type="submit">Submit Challenge</button>
        {message && <p>{message}</p>} {/* Display feedback message */}
      </form>
    </div>
  );
}

export default ChallengeSubmission;
