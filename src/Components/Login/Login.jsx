// Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [role, setRole] = useState("user"); // "user" or "admin"

  // Validate Gmail only
  const validateEmail = (value) => {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!value) {
      setEmailError("Email is required");
      return false;
    } else if (!gmailRegex.test(value)) {
      setEmailError("Only @gmail.com addresses are allowed");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (value.length < 6) {
      setPasswordError("Password must be at least 6 characters");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isEmailValid = validateEmail(email);
    const isPasswordValid = password.length >= 6;

    if (!isEmailValid) {
      setEmailError("Please enter a valid @gmail.com address");
    }
    if (!isPasswordValid) {
      setPasswordError("Password must be at least 6 characters");
    }

    if (isEmailValid && isPasswordValid) {
      // Store user info in localStorage
      const userData = {
        email,
        role,
        name: email.split('@')[0],
        loginTime: new Date().toISOString()
      };
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', 'true');

      // Navigate directly based on role (no delay)
      if (role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-root">
      {/* Background with animation */}
      <div className="login-bg">
        <div className="login-bg-image"></div>
        <div className="login-bg-overlay"></div>
        <div className="login-bg-particles">
          <span></span><span></span><span></span>
          <span></span><span></span><span></span>
          <span></span><span></span><span></span>
        </div>
      </div>

      {/* Back to Home Button */}
      <button className="login-back-btn" onClick={() => navigate("/")}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
        Back to Home
      </button>

      {/* Login Card */}
      <div className="login-card">
        <div className="login-card-inner">
          {/* Header */}
          <div className="login-header">
            <h1 className="login-title">Welcome <span>Back</span></h1>
            <p className="login-subtitle">Sign in to continue your archaeological journey</p>
          </div>

          {/* Role Selection */}
          <div className="login-role-selector">
            <button
              className={`login-role-btn ${role === "user" ? "login-role-btn--active" : ""}`}
              onClick={() => setRole("user")}
            >
              <span className="login-role-icon">👤</span>
              User
            </button>
            <button
              className={`login-role-btn ${role === "admin" ? "login-role-btn--active" : ""}`}
              onClick={() => setRole("admin")}
            >
              <span className="login-role-icon">🛡️</span>
              Admin
            </button>
          </div>

          {/* Form */}
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-form-group">
              <label htmlFor="email">
                <span className="login-label-icon">✉️</span> Email Address
              </label>
              <div className={`login-input-wrap ${emailError ? "login-input-wrap--error" : ""}`}>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="yourname@gmail.com"
                  className="login-input"
                  autoFocus
                />
              </div>
              {emailError && <span className="login-error">{emailError}</span>}
              <span className="login-hint">Only @gmail.com addresses are accepted</span>
            </div>

            <div className="login-form-group">
              <label htmlFor="password">
                <span className="login-label-icon">🔒</span> Password
              </label>
              <div className={`login-input-wrap ${passwordError ? "login-input-wrap--error" : ""}`}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter your password"
                  className="login-input"
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  )}
                </button>
              </div>
              {passwordError && <span className="login-error">{passwordError}</span>}
              <span className="login-hint">Minimum 6 characters</span>
            </div>

            <div className="login-options">
              <label className="login-checkbox">
                <input type="checkbox" />
                <span className="login-checkbox-custom"></span>
                Remember me
              </label>
              <button className="login-forgot" onClick={() => navigate("/404")}>
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="login-submit-btn"
            >
              Sign In as {role === "admin" ? "Admin" : "User"}
              <span className="login-btn-arrow">→</span>
            </button>
          </form>

          {/* Register Link at bottom */}
          <div className="login-register">
            <p>
              New to Archaeology?{" "}
              <button 
                className="login-register-link" 
                onClick={() => navigate("/register")}
              >
                Create an account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}