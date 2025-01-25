// LoginPage.jsx
import React, { useContext, useState } from 'react';
import { Link, useLoaderData, useSearchParams, Form, redirect } from 'react-router';
import {signIn} from '../../constants/utils'
import { context } from '../../context/Context';

// Updated loginLoader (proper redirect handling)
export const loginLoader = ({ request }) => {
  const user = localStorage.getItem('authorizedUser');
  const url = new URL(request.url);
  const message = url.searchParams.get('message');

  // Redirect logged-in users to home
  if (user) {
    throw redirect('/');
  }
  
  return message; // Return message only for non-authenticated users
};

// Updated actionLogin (proper error redirect)
export const actionLogin = async ({ request }) => {
  try {
    const formData = await request.formData();
    const email = formData.get('username');
    const password = formData.get('password');

    const signedUser = await signIn(email, password);
    localStorage.setItem('authorizedUser', signedUser);

    return redirect('/');
  } catch (error) {
    // Redirect with error message
    return redirect('/login?message=Invalid credentials');
  }
};

const LoginPage = () => {
  
  const [rememberMe, setRememberMe] = useState(false);
  const message = useLoaderData()

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
        <Form className="auth-form" method='post' replace >
          <h2>Sign In</h2>
          {message && <h4 style={{paddingBottom: '1rem', color: 'red' }}>{message}</h4>}
          <div className="form-group">
            <input
              type="email"
              name="username"
              placeholder="Username"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
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
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;