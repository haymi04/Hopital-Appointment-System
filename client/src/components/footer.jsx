import React from "react";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Hospital Info */}
        <div className="footer-section">
          <h2>TIBEB Hospital</h2>

          <p>
            Providing quality healthcare with trusted doctors,
            modern facilities, and compassionate service.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>

          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/doctors">Doctors</a></li>
            <li><a href="/appointments">Appointments</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h3>Contact</h3>

          <p>📍 Addis Ababa, Ethiopia</p>
          <p>📞 +251 911 123 456</p>
          <p>✉ tibeb@gmail.com</p>
        </div>

      </div>

      <hr />

      <div className="footer-bottom">
        © {new Date().getFullYear()} TIBEB Hospital. All Rights Reserved.
      </div>

    </footer>
  );
}

export default Footer;