// LoginPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router';
import {signIn} from '../../constants/utils'

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    signIn(username, password)
   
  };

  return (
    <div className="auth-container">
      <div className="left-section">
        <img 
          src='assets/Logo.jpg'
          alt="Decorative" 
          className="auth-image"
        />
      </div>
      <div className="right-section">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Sign In</h2>
          <div className="form-group">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
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
          <div className="remember-me">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
          </div>
          <button type="submit" className="auth-button">Sign In</button>
          <div className="auth-link">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;