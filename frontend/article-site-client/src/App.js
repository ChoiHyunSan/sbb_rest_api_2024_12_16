// App.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Routes from './Routes';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AuthProvider>
        <Router>
          <Routes />
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;