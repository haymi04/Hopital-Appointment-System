// client/src/App.jsx
import React, { useState, useEffect } from 'react';
import AuthPage from './components/AuthPage';
import DoctorList from './components/DoctorList';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
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
        /* Authenticated Dashboard View */
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#0b0f19',
          color: '#f3f4f6',
          padding: '24px'
        }}>
          {/* Top Header Navigation */}
          <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: '1200px',
            margin: '0 auto 24px auto',
            paddingBottom: '16px',
            borderBottom: '1px solid #1f2937'
          }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '20px', color: '#ffffff' }}>Hospital Appointment System</h2>
              <p style={{ margin: '4px 0 0 0', color: '#9ca3af', fontSize: '14px' }}>
                Welcome, <strong>{user.first_name} {user.last_name}</strong> ({user.role})
              </p>
            </div>
            <button 
              onClick={handleLogout}
              style={{
                background: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Logout
            </button>
          </header>

          {/* Main Dashboard Content */}
          <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <DoctorList />
          </main>
        </div>
      ) : (
        /* Register/Login screen */
        <AuthPage onAuthSuccess={handleAuthSuccess} />
      )}
    </>
  );
}

export default App;