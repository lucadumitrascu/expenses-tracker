import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ProgressBar from "./ProgressBar";
import styles from './Authentication.module.css';

function ForgotPassword() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [securityCode, setSecurityCode] = useState("");
    const [inputSecurityCode, setInputSecurityCode] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [pResendCodeClicked, setpResendCodeClicked] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    // Step 1 functions
    const handleSubmitEmailForm = (event) => {
        event.preventDefault();
        sendSecurityCodeToEmail();
        Swal.fire({
            title: 'Loading...',
            text: 'Please wait while we send the email.',
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
                        "Content-Type": "text/plain",
                    },
                    body: email,
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

    const handleSubmitSecurityCodeForm = (event) => {
        event.preventDefault();

        if (securityCode === inputSecurityCode) {
            setErrorMessage("");
            setStep(3);
        } else {
            setErrorMessage(inputSecurityCode + " is not a valid code.");
        }
    }

    // Step 3 functions
    const handleSubmitSetNewPasswordForm = (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setErrorMessage('Passwords must be the same.');
        } else if (password.length < 6) {
            setErrorMessage('Password must be at least 6 characters long.');
        } else {
            saveNewPassword(email, password);
        }
    };

    const saveNewPassword = async (email1, password1) => {
        try {
            const response = await fetch(
                "http://localhost:8080/api/authentication/set-new-password",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email: email1, password: password1 })
                }
            );
            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Password Changed!',
                    text: 'Your password has been successfully changed.',
                    confirmButtonText: 'Back to login'
                }).then(() =>
                    navigate("/authentication/login")
                );

            } else {
                const responseData = await response.json();
                setErrorMessage(responseData.message);
            }
        } catch (error) {
            setErrorMessage(error);
        }
    }

    // Error handling functions
    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => setErrorMessage(""), 5000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    const showErrorInSwal = (message) => {
        Swal.close();
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: message,
            showConfirmButton: true,
            allowOutsideClick: true
        });
    }


    if (step === 1) {
        return (
            <div className={styles['body-container']}>
                <div className={styles['div-authentication-container']}>
                    <h1 className={styles.title}>Expenses Tracker</h1>

                    <form id="formForgotPassword" onSubmit={handleSubmitEmailForm} method="POST">
                        <ProgressBar step={step} totalSteps={3} />
                        <hr />
                        <h2>Forgot password</h2>

                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="inputEmail"
                            name="email"
                            placeholder="abc@gmail.com"
                            onChange={(e) => setEmail(e.target.value)}
                            required />

                        <h4>A security code will be sent to this email address.</h4>

                        <div className={styles['div-buttons']} id="divButtons">
                            <button id="btnSubmitEmail" type="submit"> Submit </button>
                            <button id="btnGoBack" type="button" className={styles['btn-go-back']}
                                onClick={() => navigate("/authentication/login")}>
                                Go back
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        );
    }

    if (step === 2) {
        return (
            <div className={styles['div-authentication-container']}>
                <h1 className={styles.title}>Expenses Tracker</h1>

                <form id="formEnterSecurityCode" onSubmit={handleSubmitSecurityCodeForm}>
                    <ProgressBar step={step} totalSteps={3} />
                    <hr />
                    <h2>Enter the 6-digit code from email</h2>

                    <div>
                        <label htmlFor="securityCode">Security code:</label>
                        <input
                            type="text"
                            id="inputSecurityCode"
                            className={styles['input-security-code']}
                            name="securityCode"
                            maxLength={6}
                            required
                            value={inputSecurityCode}
                            onChange={(e) => setInputSecurityCode(e.target.value)}
                        />

                        <p className={styles['p-resend-code']} onClick={handleResendCode}>
                            Resend code
                        </p>
                    </div>

                    <span className={styles['span-error']}>{errorMessage}</span>

                    <div className={styles['div-buttons']}>
                        <button type="submit">Submit</button>
                        <button
                            type="button"
                            className={styles['btn-go-back']}
                            onClick={() => navigate("/authentication/login")}>
                            Go back
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    if (step === 3) {
        return (
            <div className={styles['div-authentication-container']}>
                <h1 className={styles.title}>Expenses Tracker</h1>

                <form id="formSetNewPassword" onSubmit={handleSubmitSetNewPasswordForm}>
                    <ProgressBar step={step} totalSteps={3} />
                    <hr />
                    <h2>Write down your new password</h2>

                    <div>
                        <label htmlFor="password" className={styles['label-password']}>
                            New Password:
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className={styles['label-password']}>
                            Confirm New Password:
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>

                    <span className={styles['span-error']}>{errorMessage}</span>

                    <div className={styles['div-buttons']}>
                        <button type="submit">Submit</button>
                        <button
                            type="button"
                            className={styles['btn-go-back']}
                            onClick={() => navigate("/authentication/login")}>
                            Go back
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

export default ForgotPassword;
