import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const handleRegisterClick = () => {
    navigate('/authentication/register');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:8080/api/authentication/login",
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      if (response.status === 200) {
        const responseData = await response.json();
        localStorage.setItem("accessToken", responseData.accessToken);
        navigate("/index");
      } else {
        setError("Incorrect username or password!");
      }
    } catch (error) {
      setError("An error occurred. Please try again!");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="div-container">
      <h1 className="title">Expenses Tracker</h1>

      <form id="form-login" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label className="label-password" htmlFor="password">
          <p>Password:</p>
          <p
            id="p-forgot-password"
            className="p-forgot-password"
            onClick={() => (navigate("/authentication/forgot-password"))}>
            Forgot Password?
          </p>
        </label>

        <div className="password-box">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            className="input-password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required />

          <i
            id="icon-show-hide-password"
            className={`fa-regular ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
            style={{ color: "grey" }}
            onClick={togglePasswordVisibility}></i>
        </div>

        <span className="span-error">{error}</span>

        <div className="div-buttons">
          <button type="submit" id="btn-submit-login">
            Login
          </button>
          <button
            type="button"
            id="btn-register"
            className="btn-register"
            onClick={() => { handleRegisterClick() }}>
            Register
          </button>
        </div>

      </form>
    </div>
  );
};

export default Login;