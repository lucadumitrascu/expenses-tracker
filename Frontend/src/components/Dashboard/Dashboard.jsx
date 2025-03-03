import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();
    const token = localStorage.getItem("accessToken");

    const apiCall = async () => {
        try {
            const response = await fetch(
                "http://localhost:8080/test/test",
                {
                    credentials: "include",
                    method: "GET",
                    headers: {
                        "Authorization": "Bearer " + token,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error("Something went wrong.", error);
        }
    };

    useEffect(() => {
        if (!token) {
            navigate("/authentication/login");
        }

        const handleBackButton = (event) => {
            event.preventDefault();
            window.history.pushState(null, "", window.location.href);
        };

        window.history.pushState(null, "", window.location.href);
        window.onpopstate = handleBackButton;

        return () => {
            window.onpopstate = null;
        };
    }, [token]);

    return (
        <div>
            <p>Dashboard #TODO</p>
            <button onClick={apiCall}>test</button>
        </div>
    )
}
export default Dashboard;