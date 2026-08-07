import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <div className="logo-icon">+</div>

        <div>
          <h2>TIBEB</h2>
          <span>HOSPITAL</span>
        </div>
      </div>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/doctors">Doctors</Link>
        <Link to="/departments">Departments</Link>
       
      </div>

      <div className="nav-buttons">
      <Link to="/login">
       <button>
      Login
      </button>
      </Link>

      <Link to="/register">
       <button className="register-btn">
      Register
      </button>
       </Link>
</div>
    </nav>
  );
}

export default Navbar;