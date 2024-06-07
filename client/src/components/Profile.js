import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import Select from 'react-select';
import '../styles/Profile.css';

const BACKEND_URL= process.env.BACKEND_URL;

const availabilityOptions = [
    { value: 'Available', label: 'Available' },
    { value: 'Busy', label: 'Busy' },
    { value: 'Offline', label: 'Offline' },
];

const responseTimeOptions = [
    { value: 'Within 24 hours', label: 'Within 24 hours' },
    { value: 'Within 48 hours', label: 'Within 48 hours' },
    { value: 'Within a week', label: 'Within a week' },
];

const Profile = () => {
    const { user } = useUser();
    const [profile, setProfile] = useState(null);
    const [availability, setAvailability] = useState('');
    const [responseTime, setResponseTime] = useState('');
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        fetch(`${BACKEND_URL}/api/users/profile/${user.username}`)
            .then(response => response.json())
            .then(data => {
                setProfile(data);
                setAvailability(data.availability);
                setResponseTime(data.responseTime);
            })
            .catch(error => console.error('Failed to fetch profile:', error));
    }, [user.username]);

    const handleSave = () => {
        fetch(`${BACKEND_URL}/api/users/profile/${user.username}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ availability, responseTime }),
        })
            .then(response => response.json())
            .then(data => {
                setProfile(data);
                setEditing(false);
            })
            .catch(error => console.error('Failed to update profile:', error));
    };

    if (!profile) return <p>Loading profile...</p>;

    return (
        <div className="profile">
            <div className="profile-left">
                <div className="profile-details">
                    <h2>{profile.username}</h2>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Joined:</strong> {new Date(profile.joined).toLocaleDateString()}</p>
                    <p><strong>Age:</strong> {profile.age}</p>
                    <p><strong>Discipline:</strong> {profile.discipline}</p>
                </div>
                <hr className="divider" />
                <div className="profile-bio">
                    <h3>Bio</h3>
                    <p>{profile.bio}</p>
                </div>
            </div>
            <div className="profile-right">
                <div className="availability-section">
                    
                    {editing ? (
                        <>
                            <label>
                                Availability:
                                <Select
                                    options={availabilityOptions}
                                    value={availabilityOptions.find(option => option.value === availability)}
                                    onChange={(selectedOption) => setAvailability(selectedOption.value)}
                                />
                            </label>
                            <label>
                                Response Time:
                                <Select
                                    options={responseTimeOptions}
                                    value={responseTimeOptions.find(option => option.value === responseTime)}
                                    onChange={(selectedOption) => setResponseTime(selectedOption.value)}
                                />
                            </label>
                            <div className="button-group">
                                <button onClick={handleSave} className="save-button">Save</button>
                                <button onClick={() => setEditing(false)} className="cancel-button">Cancel</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <p><strong>Availability:</strong> {profile.availability}</p>
                            <p><strong>Response Time:</strong> {profile.responseTime}</p>
                            <button onClick={() => setEditing(true)} className="edit-button">Edit</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
