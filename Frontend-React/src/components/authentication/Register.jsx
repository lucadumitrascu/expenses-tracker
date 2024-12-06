import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import '../../styles/auth.css';

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
        navigate('/authentication/login');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            username: name === "username" ? value : formData.username,
            email: name === "email" ? value : formData.email,
            password: name === "password" ? value : formData.password,
            confirmPassword: name === "confirmPassword" ? value : formData.confirmPassword,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords must be the same!");
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
                const errorData = await response.text();
                setError(errorData);
            }
        } catch (error) {
            setError("Something went wrong!");
        }
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

            <form id="form-register" onSubmit={handleSubmit} method="POST">
                <h2>Register</h2>

                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required />

                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required />

                <label htmlFor="confirm-password">Confirm Password:</label>
                <input
                    type="password"
                    id="confirm-password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required />

                <span className="span-error">{error}</span>

                <div id="div-buttons" className="div-buttons">
                    <button id="btn-submit-register" type="submit">
                        Register
                    </button>
                    <button
                        id="btn-login"
                        type="button"
                        className="btn-login"
                        onClick={() => { handleLoginClick() }}>
                        Login
                    </button>
                </div>

            </form>
        </div>
    );
}

export default Register;