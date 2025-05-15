import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import '../styles/navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut();
  };

  const handleDashboardRedirect = () => {
    const role = localStorage.getItem('userRole');
    if (role === 'student') navigate('/student-dashboard');
    else if (role === 'club_member') navigate('/club-dashboard');
    else if (role === 'faculty') navigate('/faculty-dashboard');
    else navigate('/');
  };

  return (
    <div className="navbar">
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <span onClick={handleDashboardRedirect} className="navbar-link">Dashboard</span>
        <Link to="/profile">Profile</Link>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
