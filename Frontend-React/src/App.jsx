import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/authentication/Login';
import Register from './components/authentication/Register';
import ForgotPassword from './components/authentication/ForgotPassword';
import Dashboard from './components/Dashboard';


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/authentication/login" />} />
        <Route path="/authentication/login" element={<Login />} />
        <Route path="/authentication/register" element={<Register />} />
        <Route path="/authentication/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={ <Dashboard /> } />
      </Routes>
    </Router>
  );
}

export default App;
