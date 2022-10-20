let user_id = "25801";
let cart_url = CART_INFO_URL + user_id + ".json";
// let cart_url = "https://japceibal.github.io/emercado-api/user_cart/25801.json"

var product_in_cart;

document.addEventListener("DOMContentLoaded", () => {
    getJSONData(cart_url).then(result => {
        product_in_cart = result.data.articles;
        console.log(product_in_cart);
    }).then(()=>{
        getNewItemFromLocalstorage();

        showCart();
    })
})

function getNewItemFromLocalstorage() {
    if (localStorage.getItem("newToCart") !== undefined) {
        product_in_cart.push(
            JSON.parse(localStorage.getItem("newToCart"))
        );
    } 
}

function addRowProduct(article) {
    const node = document.getElementById("cart-tbl");
    const node_row = document.createElement("tr");

    function createColNode(inner_html) {
        const node_col = document.createElement("td");
        node_col.innerHTML = inner_html;
        node_row.appendChild(node_col);
    }

    createColNode(`<img src="${article.image}" style="max-height:50px"></img>`);
    createColNode(`${article.name}`);
    createColNode(`${article.currency} ${article.unitCost}`);
    createColNode(`<input type="number" onchange="changeSubtotal(this)" min="0" id="inpt${article.id}">`);
    createColNode(`<b>${article.currency}</b> <b id="outpt${article.id}"></b>`)

    node.appendChild(node_row);
}

function updateInputQ(id, num, cost) {
    const input_node = document.getElementById("inpt" + id);
    input_node.setAttribute("value", num);
    input_node.setAttribute("data-id", id);
    input_node.setAttribute("data-cost", cost);

    const node_subtotal_num = document.getElementById("outpt" + id);
    node_subtotal_num.innerText = (num * cost).toLocaleString();
}

function changeSubtotal(node) {
    const node_subtotal_num = document.getElementById("outpt" + node.dataset.id);
    node_subtotal_num.innerText = (node.value * node.dataset.cost).toLocaleString();
}

function showCart () {
    product_in_cart.forEach(article => {
        addRowProduct(article);
        updateInputQ(article.id, article.count, article.unitCost);
    });
}

