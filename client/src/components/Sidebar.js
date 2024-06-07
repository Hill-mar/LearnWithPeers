import React from 'react';
import { NavLink } from 'react-router-dom';
import { BiHome, BiBookAlt, BiCodeBlock, BiCommentDetail, BiUserCircle, BiVideo, BiCaptions } from 'react-icons/bi'; // Import BiFeedback icon
import '../styles/sidebar.css';

const Sidebar = () => {
    return (
        <div className="menu">
            <div className="logo">
                <BiBookAlt className="logo-icon"/>
                <h2>LearnWithPeers</h2>
            </div>
            <div className="menu--list">
                <NavLink to="/dashboard" className="item" activeClassName="active">
                    <BiHome className="icon"/>
                    Dashboard
                </NavLink>
                <NavLink to="/submit-challenge" className="item" activeClassName="active">
                    <BiCodeBlock className="icon"/>
                    Submit Challenge
                </NavLink>
                <NavLink to="/challenges" className="item" activeClassName="active">
                    <BiBookAlt className="icon"/>
                    View Challenges
                </NavLink>
                <NavLink to="/view-attempts" className="item" activeClassName="active">
                    <BiCommentDetail className="icon"/>
                    Review Submissions
                </NavLink>
                <NavLink to="/reviewed-submissions" className="item" activeClassName="active">
                    <BiUserCircle className="icon"/>
                    Reviewed Submissions
                </NavLink>
                <NavLink to="/review-feedback" className="item" activeClassName="active">
                    <BiCaptions className="icon"/>
                    Review Feedback
                </NavLink>
            </div>
        </div>
    );
};

export default Sidebar;
