import React, { useState } from 'react';
import { Link } from 'react-router';
import { signUp } from '../../constants/utils';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tosAgree, setTosAgree] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    signUp(email, password);
    console.log({ name, email, password, confirmPassword });
  };

  return (
    <div className="auth-container">
      <div className="left-section">
        <img 
          src="assets/Logo.jpg" 
          alt="Decorative" 
          className="auth-image"
        />
      </div>
      <div className="right-section">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Create Account</h2>
          <div className="form-group">
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
            />
          </div>
          <div className="remember-me">
            <label>
              <input
                type="checkbox"
                checked={tosAgree}
                onChange={(e) => setTosAgree(e.target.checked)}
              />
              Agree with Terms of Service
            </label>
          </div>
          <button type="submit" className="auth-button">Sign Up</button>
          <div className="auth-link">
            Already have an account? <Link to="/login">Sign In</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;