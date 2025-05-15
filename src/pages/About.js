// src/pages/About.js
import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/about.css';

const About = () => {
  return (
    <div>
      <Navbar />
      <div className="about-container">
        <h1>About the MCE Student Website</h1>
        <p>
          The MCE Student Website is your one-stop destination to explore and contribute to student life at MCE. 
          Access study materials, stay updated with college events, and share your creativity through the magazine section.
        </p>
        <p>
          This platform is designed to empower students, foster collaboration, and showcase talent across all branches and years.
        </p>
        {/* Only one logout button here */}
        
      </div>
    </div>
  );
};

export default About;
