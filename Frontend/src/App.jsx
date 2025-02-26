import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import LandingPage from './components/LandingPage/LandingPage';
import Login from './components/Authentication/Login';
import Register from './components/authentication/Register';
import ForgotPassword from './components/Authentication/ForgotPassword';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/authentication/login" element={<Login />} />
        <Route path="/authentication/register" element={<Register />} />
        <Route path="/authentication/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={ <Dashboard /> } />
      </Routes>
    </Router>
  );
}

export default App;