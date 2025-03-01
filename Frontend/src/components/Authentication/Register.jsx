import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Authentication.module.css";
import GoogleLoginButton from "../Authentication/GoogleLoginButton";

function Register() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");

    const navigate = useNavigate();
    const handleLoginClick = () => {
        navigate("/authentication/login");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords must be the same!");
            return;

        } else if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long!');
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:8080/api/authentication/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: formData.username,
                        email: formData.email,
                        password: formData.password,
                    }),
                }
            );

            if (response.ok) {
                setFormData({
                    username: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                });
                navigate('/authentication/login');
            } else {
                const errorData = await response.json();
                setError(errorData.message);
            }
        } catch (error) {
            setError("Something went wrong.");
        }
    };

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(""), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    return (
        <div className={styles["div-authentication-container"]}>
            <h1 className={styles.title}>Expenses Tracker</h1>

            <form id="formRegister" onSubmit={handleSubmit} method="POST">
                <h2>Register</h2>

                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    autoComplete="username"
                    onChange={handleChange}
                    required
                />

                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    autoComplete="email"
                    onChange={handleChange}
                    required
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    autoComplete="new-password"
                    onChange={handleChange}
                    required
                />

                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    autoComplete="new-password"
                    onChange={handleChange}
                    required
                />

                <span className={styles["span-error"]}>{error}</span>

                <div className={styles["div-buttons"]}>
                    <button className={styles["btn-submit-register"]} type="submit">
                        Register
                    </button>
                    <button className={styles["btn-login"]} type="button" onClick={handleLoginClick}>
                        Login
                    </button>
                </div>
                <GoogleLoginButton />
            </form>
        </div>

    );
}

export default Register;
