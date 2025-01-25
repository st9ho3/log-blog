// LoginPage.jsx
import React, { useContext, useState } from 'react';
import { Link, useLoaderData, useSearchParams, Form, redirect } from 'react-router';
import {signIn} from '../../constants/utils'
import { context } from '../../context/Context';

export const  loginLoader = ({request}) => {
  const url = new URL(request.url).searchParams.get('message') 
  return url
}
export const actionLogin = async ({ request }) => {
  try {
    const formData = await request.formData();
    const email = await formData.get('username'); // Correct key from input's name
    const password =  formData.get('password'); 
    const signedUser = await signIn(email, password); // Pass variables
    localStorage.setItem('authorizedUser', signedUser);

    // Redirect upon success (example using React Router redirect)
    return redirect('/');
  } catch (error) {
    console.error('Invalid credentials:', error);
    // Return error message to display in the UI
    return { error: "Login failed. Check your credentials." };
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
        <Form className="auth-form" method='post' >
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