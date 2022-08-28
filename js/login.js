const login_form = document.getElementById("loginform");
login_form.addEventListener("submit", (e) => e.preventDefault());

function login(form) {
    const email_check = form.email.checkValidity();
    const password_check = !(form.password.value.length === 0);
    console.log(form);
    if (email_check && password_check) {
        // Login success
        sessionStorage.setItem("LOGGEDIN", "true");
        sessionStorage.setItem("LOGGEDIN.ACCOUNT", form.email.value);
        window.location.replace("index.html");
    } else {
        // Login fail
        window.alert("Cuenta invalida o contraseña incorrecta!");
        form.reset();
    }
}


function updateInputValidation(input, valid) {
    if (valid) {
        input.className = "form-control is-valid"
    } else {
        input.className = "form-control is-invalid"
    }
}

function checkLoginEmail(input) {
    updateInputValidation(input, input.checkValidity());
}

function checkLoginPassword(input) {
    updateInputValidation(input, !(input.value.length === 0))
}





