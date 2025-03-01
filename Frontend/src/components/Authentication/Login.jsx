import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Authentication.module.css";
import GoogleLoginButton from "../Authentication/GoogleLoginButton";

function Login() {
  const [email, setEmail] = useState("");
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
          body: JSON.stringify({ email, password }),
        }
      );

      if (response.status === 200) {
        const responseData = await response.json();
        localStorage.setItem("accessToken", responseData.message);
        console.log(responseData.message);
        navigate("/dashboard");
      } else {
        const responseData = await response.json();
        setError(responseData.message);
      }
    } catch (error) {
      setError("Something went wrong.");
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
    <div className={styles['div-authentication-container']}>
      <h1 className={styles.title}>Expenses Tracker</h1>

      <form id="formLogin" onSubmit={handleSubmit} method="POST">
        <h2>Login</h2>

        <label htmlFor="email">Email:</label>
        <input
          type="text"
          id="email"
          name="email"
          value={email}
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className={styles['label-password']} htmlFor="password">
          <p>Password:</p>
          <p
            id="pForgotPassword"
            className={styles['p-forgot-password']}
            onClick={() => navigate("/authentication/forgot-password")}>
            Forgot Password?
          </p>
        </label>

        <div className={styles['password-box']}>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            className={styles['input-password']}
            name="password"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <i
            id="iconShowHidePassword"
            className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
            style={{ color: "grey" }}
            onClick={togglePasswordVisibility}></i>
        </div>

        <span className={styles['span-error']}>{error}</span>

        <div className={styles['div-buttons']}>
          <button type="submit" id="btnSubmitLogin">
            Login
          </button>
          <button
            type="button"
            id="btnRegister"
            className={styles['btn-register']}
            onClick={() => { handleRegisterClick() }}>
            Register
          </button>
        </div>

        <GoogleLoginButton />

      </form>
    </div>
  );
}

export default Login;
