import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/authentication/login" />} />
        <Route path="/authentication/login" element={<Login />} />
        <Route path="/authentication/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
