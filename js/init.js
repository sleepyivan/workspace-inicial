const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

let showSpinner = function(){
  // document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  // document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}

function updateLoggedInAccount () {
  const node = document.getElementById("login-profile");
  const account = sessionStorage.getItem("LOGGEDIN.ACCOUNT");

  if (account !== "") {
    if (!node.classList.contains("dropdown")) {
      node.classList.add("dropdown");
    }

    node.innerHTML = `
    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
    aria-expanded="false">${account}</a>
  
    <ul class="dropdown-menu">
      <li>
        <a class="dropdown-item" href="cart.html">Mi carrito</a>
      </li>
      <li>
        <a class="dropdown-item" href="my-profile.html">Mi perfil </a>
      </li>
      <li>
        <hr class="dropdown-divider">
      </li>
      <li>
        <a class="dropdown-item" onclick="closeSession()">Cerrar sesión</a>
      </li>
    </ul>`;
  } else {
    if (node.classList.contains("dropdown")) {
      node.classList.remove();
    }
    node.innerHTML = `<a class="nav-link" href="login.html">Login</a>`;
  }
}

function closeSession() {
  sessionStorage.setItem("LOGGEDIN.ACCOUNT", "");
  sessionStorage.setItem("LOGGEDIN", "false");
  updateLoggedInAccount();
}

updateLoggedInAccount();