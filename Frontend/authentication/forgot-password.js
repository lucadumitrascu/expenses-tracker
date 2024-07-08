let submitForgotPasswordForm = document.getElementById("form-forgot-password");
let buttonGoBack = document.getElementById('btn-go-back');
let emailInput = document.getElementById("input-email");
let divContainer = document.getElementById("div-container");
let securityCode;

submitForgotPasswordForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    sendSecurityCodeToEmail(true);
    Swal.fire({
        title: 'Loading...',
        text: 'Please wait while we send the email.',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
});

buttonGoBack.addEventListener('click', function (event) {
    event.preventDefault();
    window.location.href = "login.html";
});

function createSecurityCodeForm() {
    let pSecurityCodeClicked = false;

    let securityCodeForm = document.createElement('form');
    securityCodeForm.id = 'form-enter-security-code';
    securityCodeForm.action = '#';
    securityCodeForm.method = 'post';

    let title = document.createElement('h2');
    title.textContent = "Enter the 6-digit code from email";
    securityCodeForm.appendChild(title);

    let label = document.createElement('label');
    label.classList.add("label-resend-code");
    label.htmlFor = 'security-code';

    let pSecurityCode = document.createElement("p");
    pSecurityCode.textContent = "Security Code:";
    label.appendChild(pSecurityCode);

    let spacingParagraph = document.createElement("p");
    label.appendChild(spacingParagraph);

    let pResendCode = document.createElement("p");
    pResendCode.textContent = "Resend code";
    pResendCode.classList.add("p-resend-code");
    label.appendChild(pResendCode);

    securityCodeForm.appendChild(label);

    let input = document.createElement('input');
    input.type = 'text';
    input.id = 'input-security-code';
    input.name = 'security-code';
    input.maxLength = 6;
    input.required = true;
    securityCodeForm.appendChild(input);

    let divButtons = document.createElement('div');
    divButtons.classList.add('div-buttons');

    let submitButton = document.createElement('input');
    submitButton.type = 'submit';
    submitButton.value = 'Submit';
    divButtons.appendChild(submitButton);

    let goBackButton = document.createElement('button');
    goBackButton.classList.add('btn-go-back');
    goBackButton.innerText = 'Go back';
    divButtons.appendChild(goBackButton);

    securityCodeForm.appendChild(divButtons);
    divContainer.appendChild(securityCodeForm);

    goBackButton.addEventListener('click', function (event) {
        event.preventDefault();
        window.location.href = "login.html";
    });

    securityCodeForm.addEventListener('submit', function (event) {
        event.preventDefault();
        let inputSecurityCode = document.getElementById('input-security-code').value;

        if (securityCode === inputSecurityCode) {
            securityCodeForm.style.display = "none";
            createSetNewPasswordForm();
        } else {
            showError(inputSecurityCode + " is not a valid code!", securityCodeForm);
        }
    });

    pResendCode.addEventListener("click", function () {
        if (pSecurityCodeClicked === false) {
            sendSecurityCodeToEmail(false);
            pSecurityCodeClicked = true;

            // To prevent clicking multiple times:
            setTimeout(function () {
                pSecurityCodeClicked = false;
            }, 10000);
        }
    });
}

function createSetNewPasswordForm() {
    let setNewPasswordForm = document.createElement('form');
    setNewPasswordForm.id = 'form-set-new-password';
    setNewPasswordForm.action = '#';
    setNewPasswordForm.method = 'put';

    let title = document.createElement('h2');
    title.textContent = "Write down your new password";
    setNewPasswordForm.appendChild(title);

    let labelPassword = document.createElement('label');
    labelPassword.classList.add("label-password");
    labelPassword.textContent = "New Password:";
    labelPassword.htmlFor = 'password';

    setNewPasswordForm.appendChild(labelPassword);

    let inputPassword = document.createElement('input');
    inputPassword.type = 'password';
    inputPassword.id = 'password';
    inputPassword.name = 'password';
    inputPassword.required = true;
    setNewPasswordForm.appendChild(inputPassword);

    let labelConfirmPassword = document.createElement('label');
    labelConfirmPassword.classList.add("label-password");
    labelConfirmPassword.textContent = "Confirm New Password:";
    labelConfirmPassword.htmlFor = 'confirm-password';

    setNewPasswordForm.appendChild(labelConfirmPassword);

    let inputConfirmPassword = document.createElement('input');
    inputConfirmPassword.type = 'password';
    inputConfirmPassword.id = 'confirm-password';
    inputConfirmPassword.name = 'confirm-password';
    inputConfirmPassword.required = true;
    setNewPasswordForm.appendChild(inputConfirmPassword);

    let divButtons = document.createElement('div');
    divButtons.classList.add('div-buttons');

    let submitButton = document.createElement('input');
    submitButton.type = 'submit';
    submitButton.value = 'Submit';
    divButtons.appendChild(submitButton);

    let goBackButton = document.createElement('button');
    goBackButton.classList.add('btn-go-back');
    goBackButton.innerText = 'Go back';
    divButtons.appendChild(goBackButton);

    setNewPasswordForm.appendChild(divButtons);
    divContainer.appendChild(setNewPasswordForm);

    goBackButton.addEventListener('click', function (event) {
        event.preventDefault();
        window.location.href = "login.html";
    });

    setNewPasswordForm.addEventListener('submit', function (event) {
        event.preventDefault();
        if (inputPassword.value !== inputConfirmPassword.value) {
            showError("Passwords must be the same!", setNewPasswordForm);
        } else {
            saveNewPassword(emailInput.value, inputPassword.value, setNewPasswordForm);
        }
    });
}

// Show error message
let errorMessageSet = false

function showError(message, form) {
    if (!errorMessageSet) {
        errorMessageSet = true;
        let spanError = document.createElement('span');
        spanError.classList.add('span-error');
        spanError.innerText = message;

        let divButtons = form.querySelector('.div-buttons');
        form.insertBefore(spanError, divButtons);

        setTimeout(function () {
            spanError.remove();
            errorMessageSet = false;
        }, 3000);
    }
}

async function sendSecurityCodeToEmail(generateSecurityCodeForm) {
    try {
        const response = await fetch(
            "http://localhost:8080/api/authentication/forgot-password",
            {
                method: "PUT",
                headers: {
                    "Content-Type": "text/plain",
                },
                body: emailInput.value,
            }
        );
        if (response.status === 200) {
            Swal.close();
            if (generateSecurityCodeForm) {
                submitForgotPasswordForm.style.display = "none";
                createSecurityCodeForm();
            }
            const responseData = await response.text();
            securityCode = responseData;
        } else {
            const errorData = await response.text();
            showErrorInSwal(errorData);
        }
    } catch (error) {
        showErrorInSwal(error.message);
    }
}

async function saveNewPassword(email1, password1, form) {
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
            const responseData = await response.text();
            form.style.display = "none";
            Swal.fire({
                icon: 'success',
                title: 'Password Changed!',
                text: 'Your password has been successfully changed.',
                confirmButtonText: 'Back to login'
            }).then(() => {
                window.location.href = "login.html";
            });

        } else {
            const errorData = await response.text();
            showError(errorData, form);
        }
    } catch (error) {
        showError(error, form);
    }
}

function showErrorInSwal(message) {
    Swal.close();
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
        showConfirmButton: true,
        allowOutsideClick: true
    });
}