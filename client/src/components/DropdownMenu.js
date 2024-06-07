import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BiChevronDown } from 'react-icons/bi';
import '../styles/DropdownMenu.css';

const DropdownMenu = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove the token
        navigate('/'); // Redirect to Homepage after logout
    };

    return (
        <div className="dropdown">
            <button className="dropbtn">
                Profile<BiChevronDown />
            </button>
            <div className="dropdown-content">
                <Link to="/profile">Profile</Link>
                <button onClick={handleLogout} className="logout-button">Log Out</button>
            </div>
        </div>
    );
};

export default DropdownMenu;
