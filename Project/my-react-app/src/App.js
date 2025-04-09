import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';

function App() {
  const [isSignIn, setIsSignIn] = useState(true);

  const handleAuthSuccess = () => {
    console.log("Authentication successful - redirect to main app");
  };

  return (
    <div className="App">
      <header className="App-header">        
        {isSignIn ? (
          <>
            <SignIn 
              onSwitchToSignUp={() => setIsSignIn(false)} 
              onAuthSuccess={handleAuthSuccess}
            />
          </>
        ) : (
          <>
            <SignUp 
              onSwitchToSignIn={() => setIsSignIn(true)} 
              onAuthSuccess={handleAuthSuccess}
            />
          </>
        )}
      </header>
    </div>
  );
}

export default App;