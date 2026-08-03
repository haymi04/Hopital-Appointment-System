import React, { useState } from "react";
import "../styles/AuthPage.css";

const AuthPage = ({ onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [isError, setIsError] = useState(false);

    // Form inputs state
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "PATIENT",
        first_name: "",
        last_name: "",
        phone: "",
        gender: "Male",
        date_of_birth: ""
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTabChange = (loginMode) => {
        setIsLogin(loginMode);
        setMessage(null);
        setIsError(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setIsError(false);

        const API_URL = "http://localhost:5000/api/auth";
        const endpoint = isLogin ? "/login" : "/register";

        // Filter request body based on mode
        const requestBody = isLogin 
            ? { email: formData.email, password: formData.password }
            : formData;

        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Request failed");
            }

            if (isLogin) {
                // Save token in localStorage
                localStorage.setItem("token", data.token);
                setMessage("Login successful!");
                setIsError(false);
                
                // Notify parent component that login was successful (gives user object)
                if (onAuthSuccess) {
                    onAuthSuccess(data.user);
                }
            } else {
                setMessage("Registration successful! You can now log in.");
                setIsError(false);
                // Switch to Login tab automatically after short delay
                setTimeout(() => {
                    handleTabChange(true);
                }, 2000);
            }

        } catch (error) {
            setMessage(error.message);
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className={`auth-card ${!isLogin ? "register-mode" : ""}`}>
                <div className="auth-header">
                    <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
                    <p>{isLogin ? "Sign in to access your appointments" : "Register to start booking appointments"}</p>
                </div>

                <div className="auth-tabs">
                    <button 
                        className={`auth-tab ${isLogin ? "active" : ""}`}
                        onClick={() => handleTabChange(true)}
                    >
                        Login
                    </button>
                    <button 
                        className={`auth-tab ${!isLogin ? "active" : ""}`}
                        onClick={() => handleTabChange(false)}
                    >
                        Register
                    </button>
                </div>

                {message && (
                    <div className={`alert-message ${isError ? "error" : "success"}`} style={{marginBottom: "20px"}}>
                        {message}
                    </div>
                )}

                <form className="auth-form" onSubmit={handleSubmit}>
                    {isLogin ? (
                        /* Login Form Fields */
                        <>
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input 
                                    type="email" 
                                    id="email"
                                    name="email" 
                                    required 
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input 
                                    type="password" 
                                    id="password"
                                    name="password" 
                                    required 
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Enter your password"
                                />
                            </div>
                        </>
                    ) : (
                        /* Registration Form Fields (2-Column Grid) */
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="first_name">First Name</label>
                                <input 
                                    type="text" 
                                    id="first_name"
                                    name="first_name" 
                                    required 
                                    value={formData.first_name}
                                    onChange={handleInputChange}
                                    placeholder="John"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="last_name">Last Name</label>
                                <input 
                                    type="text" 
                                    id="last_name"
                                    name="last_name" 
                                    required 
                                    value={formData.last_name}
                                    onChange={handleInputChange}
                                    placeholder="Doe"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="reg-email">Email Address</label>
                                <input 
                                    type="email" 
                                    id="reg-email"
                                    name="email" 
                                    required 
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="john.doe@example.com"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="reg-password">Password</label>
                                <input 
                                    type="password" 
                                    id="reg-password"
                                    name="password" 
                                    required 
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Choose a strong password"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="role">Role</label>
                                <select 
                                    id="role"
                                    name="role" 
                                    value={formData.role}
                                    onChange={handleInputChange}
                                >
                                    <option value="PATIENT">Patient</option>
                                    <option value="DOCTOR">Doctor</option>
                                    <option value="RECEPTIONIST">Receptionist</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Phone Number</label>
                                <input 
                                    type="tel" 
                                    id="phone"
                                    name="phone" 
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="gender">Gender</label>
                                <select 
                                    id="gender"
                                    name="gender" 
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="date_of_birth">Date of Birth</label>
                                <input 
                                    type="date" 
                                    id="date_of_birth"
                                    name="date_of_birth" 
                                    value={formData.date_of_birth}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    )}

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AuthPage;