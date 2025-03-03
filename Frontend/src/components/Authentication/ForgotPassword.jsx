import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ProgressBar from "./ProgressBar";
import styles from "./Authentication.module.css";

function ForgotPassword() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [securityCode, setSecurityCode] = useState("");
    const [inputSecurityCode, setInputSecurityCode] = useState("");
    const [error, setError] = useState("");
    const [pResendCodeClicked, setpResendCodeClicked] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const navigate = useNavigate();

    const handleGoBackClick = () => {
        navigate("/authentication/login");
    };

    // Step 1 functions
    const handleSubmitEmailForm = (e) => {
        e.preventDefault();
        sendSecurityCodeToEmail();
        Swal.fire({
            title: "Loading...",
            text: "Please wait while we send the email.",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
    }

    const sendSecurityCodeToEmail = async () => {
        try {
            const response = await fetch(
                "http://localhost:8080/api/authentication/forgot-password",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email
                    })
                }
            );

            if (response.status === 200) {
                const responseData = await response.json();
                setSecurityCode(responseData.message);

                setTimeout(() => {
                    setSecurityCode(null);
                }, 10 * 60 * 1000);

                Swal.close();
                setStep(2);
            } else {
                const responseData = await response.json();
                showErrorInSwal(responseData.message);
            }

        } catch (error) {
            showErrorInSwal(error);
        }
    }

    // Step 2 functions
    const handleResendCode = () => {
        if (!pResendCodeClicked) {
            sendSecurityCodeToEmail(email);
            setpResendCodeClicked(true);
        }
    }

    useEffect(() => {
        if (pResendCodeClicked) {
            const timer = setTimeout(() => setpResendCodeClicked(false), 10000);
            return () => clearTimeout(timer);
        }
    }, [pResendCodeClicked]);

    const handleSubmitSecurityCodeForm = (e) => {
        e.preventDefault();

        if (securityCode === inputSecurityCode) {
            setError("");
            setStep(3);
        } else {
            setError(inputSecurityCode + " is not a valid code.");
        }
    }

    // Step 3 functions
    const handleSubmitSetNewPasswordForm = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords must be the same.");
        } else if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
        } else {
            saveNewPassword();
        }
    };

    const saveNewPassword = async () => {
        try {
            const response = await fetch(
                "http://localhost:8080/api/authentication/set-new-password",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Password Changed!",
                    text: "Your password has been successfully changed.",
                    allowOutsideClick: false,
                    confirmButtonText: "Back to login",
                    confirmButtonColor: "#2ECC71",
                }).then(() =>
                    navigate("/authentication/login")
                );
            } else {
                const responseData = await response.json();
                setError(responseData.message);
            }

        } catch (error) {
            setError(error);
        }
    }

    // Error handling functions
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(""), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const showErrorInSwal = (message) => {
        Swal.close();
        Swal.fire({
            icon: "error",
            title: "Error",
            text: message,
            showConfirmButton: true,
            allowOutsideClick: false,
            confirmButtonColor: "#E74C3C",
        });
    }

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

            <form
                onSubmit={
                    step === 1 ? handleSubmitEmailForm :
                        step === 2 ? handleSubmitSecurityCodeForm : handleSubmitSetNewPasswordForm}
                method={step === 1 ? "POST" : step === 3 ? "PUT" : "POST"}>

                <ProgressBar step={step} totalSteps={3} />
                <hr />

                {step === 1 && (
                    <>
                        <h2>Forgot password</h2>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="abc@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <h4>A security code will be sent to this email address.</h4>
                    </>
                )}

                {step === 2 && (
                    <>
                        <h2>Enter the 6-digit code from email</h2>
                        <label htmlFor="securityCode">Security code:</label>
                        <input
                            type="text"
                            id="securityCode"
                            name="securityCode"
                            maxLength={6}
                            value={inputSecurityCode}
                            onChange={(e) => setInputSecurityCode(e.target.value)}
                            required
                        />
                        <p className={styles["p-resend-code"]} onClick={handleResendCode}>
                            Resend code
                        </p>
                    </>
                )}

                {step === 3 && (
                    <>
                        <h2>Write down your new password</h2>
                        <label htmlFor="password">New Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            autoComplete="new-password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <label htmlFor="confirmPassword">Confirm New Password:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            autoComplete="new-password"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </>
                )}

                <span className={styles["span-error"]}>{error}</span>

                <div className={styles["div-buttons"]}>
                    <button type="submit">
                        Submit
                    </button>
                    <button type="button" className={styles["btn-go-back"]} onClick={handleGoBackClick}>
                        Go back
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ForgotPassword;
