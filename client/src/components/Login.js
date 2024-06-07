import React, { useState } from 'react';
import '../styles/login.css';
import { useUser } from '../context/UserContext';
import emailIcon from './assets/email.png'; // Adjust the path as necessary
import passwordIcon from './assets/password.png'; // Adjust the path as necessary

function Login({ setIsLoggedIn }) {
  const { setUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // State to hold login error messages
  const BACKEND_URL= process.env.BACKEND_URL;

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${BACKEND_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      if (response.ok) {
        // Assuming the server response includes username and userId
        setUser({ username: data.username, id: data.userId }); // Set user context with username and userId
        setIsLoggedIn(true); // Set the login state to true
        localStorage.setItem('token', data.token); // Optionally save the token to localStorage
      } else {
        setMessage(data.message || 'Login failed!'); // Display an error message
      }
    } catch (error) {
      setMessage('Failed to connect to the server.'); // Handle network errors
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <div className='container'>
        <div className='header'>
          <div className='text'>Login</div>
          <div className='underline'></div>
        </div>
        <div className='inputs'>
          <div className='input'>
            <img src={emailIcon} alt="Email Icon" />
            <input type="email" placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className='input'>
            <img src={passwordIcon} alt="Password Icon" />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div className='submit-container'>
            <button className='submit' type="submit">Login</button>
          </div>
          {message && <div className="error-message">{message}</div>} {/* Display error message if any */}
        </div>
      </div>
    </form>
  );
}

export default Login;
