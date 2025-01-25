// LoginPage.jsx
import React, { useContext, useEffect, useState } from 'react';
import { Link, useLoaderData, useSearchParams, Form, redirect, useActionData, useNavigation } from 'react-router';
import {signIn, getUser} from '../../constants/utils'
import { context } from '../../context/Context';

// Updated loginLoader (proper redirect handling)
export const loginLoader = ({ request }) => {
  const user = localStorage.getItem('authorizedUser');
  const url = new URL(request.url);
  
  if (user) {
    const redirectTo = url.searchParams.get('redirectTo') || '/';
    throw redirect(redirectTo);
  }
  
  return {
    message: url.searchParams.get('message'),
    redirectTo: url.searchParams.get('redirectTo')
  };
};

// Updated actionLogin (proper error redirect)
export const actionLogin = async ({ request }) => {
  try {
    const formData = await request.formData();
    const email = formData.get('username');
    const password = formData.get('password');
    const url = new URL(request.url);
    const redirectTo = url.searchParams.get('redirectTo') || '/';

    const signedUser = await signIn(email, password);
    const userObj = await getUser(signedUser)
    localStorage.setItem('authorizedUser', JSON.stringify(userObj));
    
    return redirect(redirectTo);
  } catch (error) {
    return redirect(`/login?message=Invalid credentials`);
  }
};

const LoginPage = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const {message} = useLoaderData()
  const nav = useNavigation()

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
{/*           {loginFailMessage && <h4 style={{paddingBottom: '1rem', color: 'red' }}>{loginFailMessage}</h4>}
 */}          <div className="form-group">
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
          <button
          disabled={nav.state === 'submitting'}
          style={nav.state === 'submitting' ? {backgroundColor: 'gray'} : null}
          type="submit" className="auth-button">
            {nav.state === 'submitting' ? 'Logging in...' : 'Sign in'}
            </button>
          <div className="auth-link">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;