import React from 'react';
import './Auth.css'; 

function SignIn({ onSwitchToSignUp }) {
  return (
    <div className="auth-container">
      <div className="auth-logo">
        <img src="/logo.png" alt="Schedullini Logo" /> {/* Replace with your actual logo path */}
      </div>
      
      <h2>Sign in</h2>
      
      <button className="google-signin">
        Sign in with Google
      </button>
      
      <div className="divider">OR</div>
      
      <form className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email Address:</label>
          <input type="email" id="email" name="email" required />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>
        
        <button type="submit" className="auth-button">Sign In</button>
      </form>
      
      <p className="auth-switch">
        Don't have an account? <button onClick={onSwitchToSignUp} className="switch-link">Sign up</button>
      </p>
    </div>
  );
}

export default SignIn;