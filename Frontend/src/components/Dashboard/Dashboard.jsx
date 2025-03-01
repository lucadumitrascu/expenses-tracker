import React from "react";

function Dashboard() {

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


    return (
        <div>
            <p>Dashboard #TODO</p>
            <button onClick={apiCall}>test</button>
        </div>
    )
}
export default Dashboard;