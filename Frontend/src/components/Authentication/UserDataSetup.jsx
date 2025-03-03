import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ProgressBar from "./ProgressBar";
import styles from "./Authentication.module.css";

const UserDataSetup = () => {
    const [step, setStep] = useState(1);
    const [username, setUsername] = useState("");
    const [salary, setSalary] = useState();
    const [salaryDay, setSalaryDay] = useState();
    const [budget, setBudget] = useState();
    const [currency, setCurrency] = useState("RON");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const token = localStorage.getItem("accessToken");

    const handleSubmitUsername = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:8080/api/users/user-details/username",
                {
                    credentials: "include",
                    method: "PUT",
                    headers: {
                        "Authorization": "Bearer " + token,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: username,
                    }),
                }
            );

            if (response.status == 200) {
                setStep(step + 1);
                setError("");
            } else {
                const responseData = await response.json();
                setError(responseData.message);
            }

        } catch (error) {
            setError("Something went wrong. " + error);
        }
    };

    const handleSubmitSalary = async (e) => {
        e.preventDefault();

        if (salary.length > 10) {
            setError("The salary exceeds the allowed limit.");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:8080/api/users/financial-details",
                {
                    credentials: "include",
                    method: "PUT",
                    headers: {
                        "Authorization": "Bearer " + token,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        salary: salary,
                        salaryDay: salaryDay,
                    }),
                }
            );

            if (response.status == 200) {
                setSalary("");
                setSalaryDay("");
                setStep(step + 1);
                setError("");
            } else {
                const responseData = await response.json();
                setError(responseData.message);
            }

        } catch (error) {
            setError("Something went wrong." + error);
        }
    };

    const handleNoSalary = () => {
        setSalary(null);
        setSalaryDay(null);
        setStep(step + 1);
    }

    const handleSubmitBudgetAndCurrency = async (e) => {
        e.preventDefault();

        if (budget.length > 10) {
            setError("The budget exceeds the allowed limit.");
            return;
        }

        if (!budget || isNaN(budget) || Number(budget) < 0) {
            setError("Please enter a valid budget.");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:8080/api/users/financial-details",
                {
                    credentials: "include",
                    method: "PUT",
                    headers: {
                        "Authorization": "Bearer " + token,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        budget: budget,
                        currency: currency,
                    }),
                }
            );

            if (response.status == 200) {
                setError("");
                Swal.fire({
                    icon: "success",
                    title: "Setup Completed!",
                    text: "The information can be changed anytime in settings",
                    allowOutsideClick: false,
                    confirmButtonText: "Go to Dashboard",
                    confirmButtonColor: "#2ECC71",
                }).then(() => navigate("/dashboard"));
            } else {
                const responseData = await response.json();
                setError(responseData.message);
            }

        } catch (error) {
            setError("Something went wrong." + error);
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
            window.history.pushState(null, "", window.location.href);
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

            <form method="PUT" onSubmit={
                step === 1 ? handleSubmitUsername :
                    step === 2 ? handleSubmitSalary : handleSubmitBudgetAndCurrency}>

                <ProgressBar step={step} totalSteps={3} />
                <hr />

                {step === 1 && (
                    <>
                        <h2>Complete your account setup</h2>
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            placeholder="Enter your username"
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />

                        <span className={styles["span-error"]}>{error}</span>

                        <h4>This username will be shown in the application.</h4>
                        <div className={styles["div-buttons"]}>
                            <button type="submit">Next</button>
                        </div>
                    </>
                )}

                {step === 2 && (
                    <>
                        <h2>Complete your account setup</h2>
                        <label htmlFor="salary">Salary:</label>
                        <input
                            type="number"
                            id="salary"
                            name="salary"
                            step="0.01"
                            placeholder="Enter your salary"
                            value={salary}
                            onChange={(e) => setSalary(e.target.value)}
                            required
                        />
                        <label htmlFor="salaryDay">Salary Day:</label>
                        <input
                            type="number"
                            id="salaryDay"
                            name="salaryDay"
                            min="1"
                            max="31"
                            placeholder="Enter day (1-31)"
                            value={salaryDay}
                            onChange={(e) => setSalaryDay(e.target.value)}
                            required
                        />

                        <span className={styles["span-error"]}>{error}</span>

                        <div className={styles["div-buttons"]}>
                            <button type="submit">
                                Next
                            </button>
                            <button type="button" className={styles["btn-no-salary"]} onClick={handleNoSalary}>
                                I don't have a salary
                            </button>
                        </div>
                    </>
                )}

                {step === 3 && (
                    <>
                        <h2>Complete your account setup</h2>
                        <label htmlFor="budget">Budget:</label>
                        <input
                            type="number"
                            id="budget"
                            name="budget"
                            step="0.01"
                            value={budget}
                            placeholder="Enter your current budget"
                            onChange={(e) => setBudget(e.target.value)}
                            required
                        />
                        <label htmlFor="currency">Currency:</label>
                        <select
                            id="currency"
                            name="currency"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            required
                        >
                            <option value="RON">RON</option>
                            <option value="EUR">EUR</option>
                            <option value="USD">USD</option>
                        </select>

                        <span className={styles["span-error"]}>{error}</span>

                        <div className={styles["div-buttons"]}>
                            <button type="submit">Finish</button>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
};

export default UserDataSetup;
