import React from "react";
import "../styles/About.css";
import hospitalimage from "../assets/hospitalimage.png";

function About() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <h1>About TIBEB Hospital</h1>
        <p>
          Dedicated to providing world-class, compassionate healthcare and 
          making appointment booking seamless for everyone.
        </p>
      </section>

      <div className="about-container">
        {/* Our Story Section */}
        <section className="about-section">
          <h2>Our Story</h2>
          <div className="story-content">
            <div className="story-text">
              <p>
                Founded on the belief that healthcare should be accessible, high quality, and 
                patient-centered, TIBEB Hospital has been serving our community with excellence. 
                Our state-of-the-art facility integrates advanced medical technologies with compassionate clinical care.
              </p>
              <p>
                Through this digital platform, we seek to bridge the gap between patients and doctors. 
                We aim to make scheduling and managing appointments effortless, allowing you to focus on what matters 
                most—your health and well-being.
              </p>
            </div>
            <div className="story-image">
              <img src={hospitalimage} alt="TIBEB Hospital Building" />
            </div>
          </div>
        </section>

        {/* Our Core Values Section */}
        <section className="about-section">
          <h2>Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">❤️</div>
              <h3>Compassion</h3>
              <p>We treat every patient with kindness, respect, and deep understanding.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">⭐</div>
              <h3>Excellence</h3>
              <p>We hold ourselves to the highest standards of medical service and patient care.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">💡</div>
              <h3>Innovation</h3>
              <p>We embrace modern healthcare tech to deliver better diagnostic and scheduling solutions.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>Integrity</h3>
              <p>Transparency and ethical clinical practices form the foundation of our services.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default About;