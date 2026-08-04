import React, { useState, useEffect } from 'react';
import AuthPage from './components/AuthPage';
import LandingPage from './pages/LandingPage';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in (has token)
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Fetch user details from protected backend route
          const response = await fetch('http://localhost:5000/api/auth/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await response.json();
          if (response.ok) {
            setUser(data.user);
          } else {
            // Token expired or invalid
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error("Auth check failed:", error);
        }
      }
      setLoading(false);
    };

    checkUserLoggedIn();
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0b0f19',
        color: '#9ca3af'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <>
      {user ? (
        /* Protected Dashboard View (Placeholding for the next steps) */
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#0b0f19',
          color: '#f3f4f6',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h1 style={{ marginBottom: '10px' }}>Hospital Appointment System</h1>
          <p style={{ color: '#9ca3af', marginBottom: '20px' }}>
            Welcome back, <strong>{user.first_name} {user.last_name}</strong>! You are logged in as a <strong>{user.role}</strong>.
          </p>
          <button 
            onClick={handleLogout}
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        /* Register/Login screen */
       showAuth ? (
  <AuthPage onAuthSuccess={handleAuthSuccess} />
) : (
  <LandingPage onLoginClick={() => setShowAuth(true)} />
)
      )}
    </>
  );
}

export default App;