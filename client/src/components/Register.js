import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/register.css';

import user_icon from './assets/person.png';
import email_icon from './assets/email.png';
import password_icon from './assets/password.png';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [discipline, setDiscipline] = useState('');
  const [bio, setBio] = useState('');
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const BACKEND_URL= process.env.BACKEND_URL;

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Basic client-side validation
    if (!username || !email || !password || !age || !discipline || !bio) {
      setMessage('All fields are required');
      return;
    }
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters long');
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, age, discipline, bio }),
      });
      const data = await response.json();
      if (response.ok) {
        navigate('/registration-success'); // Navigate to the success page
      } else {
        setMessage(data.message || 'Registration failed!');
      }
    } catch (error) {
      setMessage('Failed to connect to the server.'); // Handle network errors
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='container'>
        <div className='header'>
          <div className='text'>Register</div>
          <div className='underline'></div>
        </div>

        <div className='inputs'>
          <div className='input'>
            <img src={user_icon} alt="User Icon" />
            <input type="text" placeholder='Name' value={username} onChange={e => setUsername(e.target.value)} />
          </div>

          <div className='input'>
            <img src={email_icon} alt="Email Icon" />
            <input type="email" placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div className='input'>
            <img src={password_icon} alt="Password Icon" />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>

          <div className='input'>
            <input type="number" placeholder="Age" value={age} onChange={e => setAge(e.target.value)} />
          </div>

          <div className='input'>
            <input type="text" placeholder="Discipline" value={discipline} onChange={e => setDiscipline(e.target.value)} />
          </div>

          <div className='input'>
            <textarea placeholder="Bio" value={bio} onChange={e => setBio(e.target.value)} />
          </div>

          <div className='submit-container'>
            <button className='submit' type="submit">Register</button>
          </div>
        </div>

        {message && <div className="registration-message">{message}</div>}
      </div>
    </form>
  );
}

export default Register;
