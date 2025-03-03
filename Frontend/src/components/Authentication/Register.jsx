import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GoogleLoginButton from "../Authentication/GoogleLoginButton";
import styles from "./Authentication.module.css";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate("/authentication/login");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords must be the same!");
            return;

        } else if (password.length < 6) {
            setError("Password must be at least 6 characters long!");
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
                        email: email,
                        password: password
                    }),
                }
            );

            if (response.status === 201) {
                const responseData = await response.json();
                localStorage.setItem("accessToken", responseData.message);
                navigate("/authentication/user-setup");
            } else {
                const responseData = await response.json();
                setError(responseData.message);
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

    useEffect(() => {
        const handleBackButton = (event) => {
            event.preventDefault();
            navigate("/authentication/login");
        };

        window.history.pushState(null, "", window.location.href);
        window.onpopstate = handleBackButton;

        return () => {
            window.onpopstate = null;
        };
    }, []);

    return (
        <div className={styles["div-authentication-container"]}>
            <h1 className={styles.title}>Expenses Tracker</h1>

            <form id="formRegister" onSubmit={handleSubmit} method="POST">
                <h2>Register</h2>

                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    autoComplete="email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    autoComplete="new-password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    autoComplete="new-password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                <span className={styles["span-error"]}>{error}</span>

                <div className={styles["div-buttons"]}>
                    <button type="submit">
                        Register
                    </button>
                    <button type="button" className={styles["btn-login"]} onClick={handleLoginClick}>
                        Login
                    </button>
                </div>
                <GoogleLoginButton />
            </form>
        </div>
    );
}

export default Register;
