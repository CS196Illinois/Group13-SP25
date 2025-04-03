import React from 'react';
import './Auth.css'; 

function SignUp({ onSwitchToSignIn }) {
  return (
    <div className="auth-container">
      <div className="auth-logo">
        <img src="/logo.png" alt="Schedulüni Logo" /> {/* Replace with the path of the schedullini image */}
      </div>
      
      <h2>Create Account</h2>
      
      <button className="google-signin">
        Sign up with Google
      </button>
      
      <div className="divider">OR</div>
      
      <form className="auth-form">
        <div className="form-group">
          <label htmlFor="fullName">Full Name:</label>
          <input type="text" id="fullName" name="fullName" required />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email Address:</label>
          <input type="email" id="email" name="email" required />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>
        
        <button type="submit" className="auth-button">Create Account</button>
      </form>
      
      <p className="auth-switch">
        Already have an account? <button onClick={onSwitchToSignIn} className="switch-link">Sign in</button>
      </p>
    </div>
  );
}

export default SignUp;