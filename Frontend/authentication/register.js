let submitRegisterForm = document.getElementById("form-register");
let email;

submitRegisterForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirm-password").value;
    let username = document.getElementById("username").value;

    if (password === confirmPassword) {
        // Make POST request
        try {
            const response = await fetch(
                "http://localhost:8080/api/authentication/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email: email, password: password, username: username }),
                }
            );

            if (response.ok) {
                window.location.href = "login.html"; 
            } else {
                const errorData = await response.text();
                showError(errorData);
            }
        } catch (error) {
            showError("Something went wrong!");
        }
    } else {
        showError("Passwords must be the same!");
    }
});

document.getElementById("btn-login").addEventListener("click", function(){
    window.location.href = "login.html";
});

let spanError = document.createElement('span');
let divButtons = document.getElementById("div-buttons");

function showError(message) {
    spanError.classList.add('span-error'); 
    spanError.innerText = message; 
    submitRegisterForm.insertBefore(spanError, divButtons); 
    setTimeout(function () {
        spanError.remove(); 
    }, 5000);
}