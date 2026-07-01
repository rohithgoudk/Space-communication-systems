// Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Validation functions
  const validateFullName = (value) => {
    const alphabetsOnly = /^[A-Za-z\s]+$/;
    if (!value.trim()) {
      return "Full name is required";
    }
    if (!alphabetsOnly.test(value)) {
      return "Full name must contain only alphabets (A-Z)";
    }
    if (value.trim().length < 2) {
      return "Full name must be at least 2 characters";
    }
    return "";
  };

  const validateUsername = (value) => {
    const alphabetsOnly = /^[A-Za-z]+$/;
    if (!value.trim()) {
      return "Username is required";
    }
    if (!alphabetsOnly.test(value)) {
      return "Username must contain only alphabets (A-Z)";
    }
    if (value.length < 3) {
      return "Username must be at least 3 characters";
    }
    return "";
  };

  const validateEmail = (value) => {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!value) {
      return "Email is required";
    }
    if (!gmailRegex.test(value)) {
      return "Only @gmail.com addresses are allowed";
    }
    return "";
  };

  const validatePassword = (value) => {
    if (!value) {
      return "Password is required";
    }
    if (value.length < 6) {
      return "Password must be at least 6 characters";
    }
    return "";
  };

  const validateConfirmPassword = (value) => {
    if (!value) {
      return "Please confirm your password";
    }
    if (value !== formData.password) {
      return "Passwords do not match";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // For full name, filter out non-alphabetic characters
    let newValue = type === "checkbox" ? checked : value;
    if (name === "fullName") {
      newValue = value.replace(/[^A-Za-z\s]/g, '');
    }
    if (name === "username") {
      newValue = value.replace(/[^A-Za-z]/g, '');
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Real-time validation
    let error = "";
    switch (name) {
      case "fullName":
        error = validateFullName(newValue);
        break;
      case "username":
        error = validateUsername(newValue);
        break;
      case "email":
        error = validateEmail(newValue);
        break;
      case "password":
        error = validatePassword(newValue);
        // Also validate confirm password if it exists
        if (formData.confirmPassword) {
          const confirmError = validateConfirmPassword(formData.confirmPassword);
          setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
        }
        break;
      case "confirmPassword":
        error = validateConfirmPassword(newValue);
        break;
      case "acceptTerms":
        error = newValue ? "" : "Please accept the Terms & Conditions to continue";
        break;
      default:
        break;
    }
    
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const fullNameError = validateFullName(formData.fullName);
    const usernameError = validateUsername(formData.username);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(formData.confirmPassword);
    const termsError = !formData.acceptTerms ? "Please accept the Terms & Conditions to continue" : "";
    
    const newErrors = {
      fullName: fullNameError,
      username: usernameError,
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
      acceptTerms: termsError
    };
    
    setErrors(newErrors);
    
    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error !== "");
    
    if (!hasErrors) {
      setIsLoading(true);
      // Simulate signup
      setTimeout(() => {
        setIsLoading(false);
        navigate("/404");
      }, 1500);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSocialLogin = (provider) => {
    navigate("/404");
  };

  return (
    <div className="signup-root">
      {/* Background with animation */}
      <div className="signup-bg">
        <div className="signup-bg-image"></div>
        <div className="signup-bg-overlay"></div>
        <div className="signup-bg-particles">
          <span></span><span></span><span></span>
          <span></span><span></span><span></span>
          <span></span><span></span><span></span>
        </div>
      </div>

      {/* Back to Home Button */}
      <button className="signup-back-btn" onClick={() => navigate("/")}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
        Back to Home
      </button>

      {/* Signup Card */}
      <div className="signup-card">
        <div className="signup-card-inner">
          {/* Header */}
          <div className="signup-header">
            <h1 className="signup-title">Create <span>Account</span></h1>
            <p className="signup-subtitle">Join the Strata archaeological community</p>
          </div>

          {/* Form */}
          <form className="signup-form" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="signup-form-group">
              <label htmlFor="fullName">
                <span className="signup-label-icon">👤</span> Full Name
              </label>
              <div className={`signup-input-wrap ${errors.fullName ? "signup-input-wrap--error" : ""}`}>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="signup-input"
                  autoFocus
                  maxLength="50"
                />
              </div>
              {errors.fullName && <span className="signup-error">{errors.fullName}</span>}
              <span className="signup-hint">Only alphabets (A-Z) are allowed</span>
            </div>

            {/* Username */}
            <div className="signup-form-group">
              <label htmlFor="username">
                <span className="signup-label-icon">🔑</span> Username
              </label>
              <div className={`signup-input-wrap ${errors.username ? "signup-input-wrap--error" : ""}`}>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username (alphabets only)"
                  className="signup-input"
                  maxLength="20"
                />
              </div>
              {errors.username && <span className="signup-error">{errors.username}</span>}
              <span className="signup-hint">Only alphabets (A-Z) are allowed</span>
            </div>

            {/* Email */}
            <div className="signup-form-group">
              <label htmlFor="email">
                <span className="signup-label-icon">✉️</span> Email Address
              </label>
              <div className={`signup-input-wrap ${errors.email ? "signup-input-wrap--error" : ""}`}>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="yourname@gmail.com"
                  className="signup-input"
                />
              </div>
              {errors.email && <span className="signup-error">{errors.email}</span>}
              <span className="signup-hint">Only @gmail.com addresses are accepted</span>
            </div>

            {/* Password */}
            <div className="signup-form-group">
              <label htmlFor="password">
                <span className="signup-label-icon">🔒</span> Password
              </label>
              <div className={`signup-input-wrap ${errors.password ? "signup-input-wrap--error" : ""}`}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className="signup-input"
                  maxLength="30"
                />
                <button
                  type="button"
                  className="signup-password-toggle"
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
              {errors.password && <span className="signup-error">{errors.password}</span>}
              <span className="signup-hint">Minimum 6 characters</span>
            </div>

            {/* Confirm Password */}
            <div className="signup-form-group">
              <label htmlFor="confirmPassword">
                <span className="signup-label-icon">✓</span> Confirm Password
              </label>
              <div className={`signup-input-wrap ${errors.confirmPassword ? "signup-input-wrap--error" : ""}`}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="signup-input"
                  maxLength="30"
                />
                <button
                  type="button"
                  className="signup-password-toggle"
                  onClick={toggleConfirmPasswordVisibility}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
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
              {errors.confirmPassword && <span className="signup-error">{errors.confirmPassword}</span>}
            </div>

            {/* Terms & Conditions */}
            <div className="signup-terms">
              <label className="signup-checkbox">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                />
                <span className="signup-checkbox-custom"></span>
                I accept the <a href="#" className="signup-terms-link">Terms & Conditions</a>
              </label>
              {errors.acceptTerms && <span className="signup-error signup-error--terms">{errors.acceptTerms}</span>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`signup-submit-btn ${isLoading ? "signup-submit-btn--loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="signup-spinner"></span>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <span className="signup-btn-arrow">→</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="signup-divider">
            <span>or continue with</span>
          </div>

          {/* Social Login */}
          <div className="signup-social">
            <button 
              className="signup-social-btn"
              onClick={() => handleSocialLogin("google")}
            >
              <span>🔴</span> Google
            </button>
            <button 
              className="signup-social-btn"
              onClick={() => handleSocialLogin("facebook")}
            >
              <span>🔵</span> Facebook
            </button>
            <button 
              className="signup-social-btn"
              onClick={() => handleSocialLogin("github")}
            >
              <span>⚫</span> GitHub
            </button>
          </div>

          {/* Login Link at bottom */}
          <div className="signup-login">
            <p>
              Already have an account?{" "}
              <button 
                className="signup-login-link" 
                onClick={() => navigate("/login")}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}