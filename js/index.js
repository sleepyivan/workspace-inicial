function checkLoginStatus() {
    if (sessionStorage.getItem("LOGGEDIN") === null) {
        sessionStorage.setItem("LOGGEDIN", "false");
        sessionStorage.setItem("LOGGEDIN.PRINTED", "false");
        sessionStorage.setItem("LOGGEDIN.ACCOUNT", "");
    }
    if (sessionStorage.getItem("LOGGEDIN") === "false") {
        window.location = "login.html"
    }
    if (sessionStorage.getItem("LOGGEDIN") === "true" && sessionStorage.getItem("LOGGEDIN.PRINTED") === "false") {
        updateLoggedInAccount();
        window.alert("Gracias por ingresar!");
        sessionStorage.setItem("LOGGEDIN.PRINTED", "true");
    }
}

document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("autos").addEventListener("click", function() {
        localStorage.setItem("catID", 101);
        window.location = "products.html"
    });
    document.getElementById("juguetes").addEventListener("click", function() {
        localStorage.setItem("catID", 102);
        window.location = "products.html"
    });
    document.getElementById("muebles").addEventListener("click", function() {
        localStorage.setItem("catID", 103);
        window.location = "products.html"
    });
});

window.addEventListener("load", checkLoginStatus());