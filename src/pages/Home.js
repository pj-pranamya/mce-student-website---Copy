import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import Navbar from '../components/Navbar'; // Import Navbar component
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  // Handle Sign Up button click
  const handleSignUp = () => {
    navigate('/signup'); // Redirects to the sign-up page
  };

  // Handle Login button click
  const handleLogin = () => {
    navigate('/login'); // Redirects to the login page
  };

  return (
    <div>
      <Navbar />
      <div className="home-container">
        <section className="intro-section">
          <h1>Welcome to the MCE Student Companion</h1> {/* Updated title */}
          <p>Connect, Learn, Communicate.</p> {/* Updated text */}
          <div className="cta-buttons">
            <button className="cta-btn" onClick={handleSignUp}>Sign Up</button> {/* Add onClick event */}
            <button className="cta-btn" onClick={handleLogin}>Login</button> {/* Add onClick event */}
          </div>
        </section>
      </div>
      <footer>
        <p>&copy; 2025 MCE Student Companion | All Rights Reserved</p> {/* Updated footer */}
      </footer>
    </div>
  );
};

export default Home;
