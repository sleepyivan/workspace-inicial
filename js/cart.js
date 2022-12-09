let user_id = "25801";
let cart_url = CART_INFO_URL + user_id + ".json";
// const cart_url = "https://japceibal.github.io/emercado-api/user_cart/25801.json"

var product_in_cart;

let cost_lst = {
    items: [],
    sum: {subtotal:0, delivery:0, total:0},
    delivery_ratio: 0.05,
    currency_changeToUSD: {USD : 1, UYU : 1/4},
    
    getItemSubtotalCost: function() {
        this.items = product_in_cart.map(item => {
            return {currency: item.currency, num: item.count * item.unitCost}
        })
    },
    
    updateSubtotalCost: function() {
        this.sum.subtotal = this.items.map((item) => {
            return item.num * this.currency_changeToUSD[item.currency]
        }).reduce((a, b) => {
            return a + b
        }, 0);
    },
   
    updateDeliveryCost: function() {
        this.sum.delivery = this.sum.subtotal * this.delivery_ratio;
    },

    updateTotalCost: function() {
        this.sum.total = this.sum.subtotal + this.sum.delivery;
    }

};


function getNewItemFromLocalstorage() {
    if (localStorage.getItem("newToCart") !== undefined) {
        const items_in_local = JSON.parse(localStorage.getItem("newToCart"));
        
        items_in_local.forEach(
            item => product_in_cart.push(item)
        )
    } 
}

function showCart() {
    function addRowProduct(index) {
        let article = product_in_cart[index];
        const node_row = document.createElement("tr");
    
        function createColNode(inner_html) {
            const node_col = document.createElement("td");
            node_col.innerHTML = inner_html;
            node_row.appendChild(node_col);
        }
    
        createColNode(`<img src="${article.image}" style="max-height:75px"></img>`);
        createColNode(`${article.name}`);
        createColNode(`${article.currency} ${article.unitCost.toLocaleString()}`);
        createColNode(
            `<input type="number" class="form-control" min="0" value="${article.count}" name="tbl_qty_item_${article.id}"
                onchange="changeCostLstItems(this)" data-index="${index}" data-id=${article.id}
                style="max-width:100px;"
            >`
        );
        createColNode(`<b>${article.currency}</b> <b id="tbl_subtotal_item_${article.id}">${cost_lst.items[index].num.toLocaleString()}</b>`);
        createColNode(`<button class="btn btn-outline-danger" onclick="removeItem(this.dataset.index)" data-index=${index}><i class="fa fa-trash-alt" aria-hidden="true"></i></button>`);
    
        node.appendChild(node_row);
    }

    const node = document.getElementById("cart-tbl");
    node.innerHTML = "";

    for (let i=0; i < product_in_cart.length; i++) {
        addRowProduct(i);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    getJSONData(cart_url).then(result => {
        product_in_cart = result.data.articles;
        console.log(product_in_cart);
    }).then(()=>{
        getNewItemFromLocalstorage();
        cost_lst.getItemSubtotalCost();
        showCart();
        updateCost();
        // updateCostSubtotal();
    })
})

function changeCostLstItems(node) {
    const item_index = node.dataset.index;
    const item_id = node.dataset.id;

    // change product_in_cart
    product_in_cart[item_index].count = node.value;
    // change cost_lst
    cost_lst.getItemSubtotalCost();
    updateCost();

    const node_subtotal_num = document.getElementById(`tbl_subtotal_item_${item_id}`);
    node_subtotal_num.innerText = cost_lst.items[item_index].num.toLocaleString();
}

// Entrega 6

function updateCost() {
    cost_lst.updateSubtotalCost();
    cost_lst.updateDeliveryCost();
    cost_lst.updateTotalCost();

    function showCost() {
        document.getElementById("cost-subtotal").textContent = cost_lst.sum.subtotal.toLocaleString();
        document.getElementById("cost-delivary").textContent = cost_lst.sum.delivery.toLocaleString();
        document.getElementById("cost-total").textContent = cost_lst.sum.total.toLocaleString();
    }
    
    showCost();
}

function changeDeliveryRate(rate) {
    cost_lst.delivery_ratio = rate;
    updateCost();
}

function updatePayFormat(id) {
    function updateText(text) {
        document.getElementById("pay-format-text").textContent = text;
    }

    switch (id) {
        case "pay-credit":
            updateText("Pagar con tarjeta de credit.");
            disableNodes('[id^="pay-bank."]');
            activeNodes('[id^="pay-credit."]');
            break;
    
        case "pay-bank":
            updateText("Pagar con transferencia bancaria.");
            disableNodes('[id^="pay-credit."]');
            activeNodes('[id^="pay-bank."]');
            break;
    }
    
    function activeNodes(query) {
        const nodes_lst = document.querySelectorAll(query);
        nodes_lst.forEach( node => {
            node.removeAttribute("disabled");
            node.classList.remove("is-invalid");
            node.classList.remove("is-valid");
        })
    }

    function disableNodes(query) {
        const nodes_lst = document.querySelectorAll(query);
        nodes_lst.forEach( node => {
            node.setAttribute("disabled", "");
            node.classList.remove("is-invalid");
            node.classList.remove("is-valid");
        })
    }


}

function validateAlert() {
    function checkNodeListValidation(node_lst, validate, reduced_output=false) {
        let validation_lst = [];
        node_lst.forEach(node => {
            if (validate(node)) {
                validation_lst.push(true);
                node.classList.remove("is-invalid");
                node.classList.add("is-valid");
            } else {
                validation_lst.push(false);
                node.classList.remove("is-valid");
                node.classList.add("is-invalid");
            }
        })

        if (reduced_output) {
            return validation_lst.every(istrue => istrue);
        } else {
            return validation_lst;
        }
    }

    let validation_check = [];

    const nodes_tbl_qty = document.querySelectorAll('[name^="tbl_qty_item"');
    validation_check.push(
        checkNodeListValidation(nodes_tbl_qty, node => {return node.value > 0}, reduced_output=true)
    );


    const nodes_address = document.querySelectorAll('[name^="address-"]');
    validation_check.push(
        checkNodeListValidation(nodes_address, node => {return node.value !== ""}, reduced_output=true)
    );

    function checkNodesSelected(node_lst, lgloutput=true) {
        let checked_lst = [];
        node_lst.forEach( node => {
            checked_lst.push(node.checked);
        });
        if (lgloutput) {
            return checked_lst.some(checked => checked);
        } else {
            return checked_lst.indexOf(true);
        }
    }

    const nodes_delivery = document.querySelectorAll('[name="delivery_rate"]');
    function checkNodesValidate_delivery(node_lst) {
        const node_link = document.getElementById("delivery_type");
        if (checkNodesSelected(node_lst)) {
            node_link.classList.remove("is-invalid");
            return true;
        } else {
            node_link.classList.add("is-invalid");
            return false;
        }
    }
    validation_check.push(
        checkNodesValidate_delivery(nodes_delivery)
    );

    const nodes_payformat = document.querySelectorAll('[name="payformat"]');
    function checkNodesValidate_payformt(node_lst) {
        let validate = false;
        const node_link = document.getElementById("pay-format-text");

        if (checkNodesSelected(node_lst)) {
            let node = node_lst[checkNodesSelected(node_lst, false)];
            let sub_nodes_id_parttern = "";

            switch (node.id) {
                case "pay-credit": sub_nodes_id_parttern = '[id^="pay-credit."]'; 
                    break;
            
                case "pay-bank": sub_nodes_id_parttern = '[id^="pay-bank."]'; 
                    break;
            }

            const sub_nodes = document.querySelectorAll(sub_nodes_id_parttern);
            validate = checkNodeListValidation(sub_nodes, node => {
                return node.value !== ""
            }, reduced_output=true);

        } 

        if (validate) {
            node_link.classList.remove("is-invalid");
            node_link.classList.add("is-valid");
        } else {
            node_link.classList.remove("is-valid");
            node_link.classList.add("is-invalid");
        }
        return validate
    }

    validation_check.push(
        checkNodesValidate_payformt(nodes_payformat)
    );
    
    return validation_check.every(allchecked => allchecked)
}

function raiseAlertSuccess() {
    const alert_node = document.getElementById("alter-placeholder");
    alert_node.innerHTML = `
    <div class="alert alert-success d-flex justify-content-between" role="alert"
      style="position:fixed; top:40vh; z-index:1;">
      ¡Has comprado con éxito!
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
}

document.getElementById("buybuybuy").addEventListener("click", () =>{
    if (validateAlert()) {
        raiseAlertSuccess();
    }
})

// Entrega 6 desafia te
function removeItem(index_remove) {
    product_in_cart = product_in_cart.filter(
        (value, index) => {
            return index != index_remove
        }
    )
    console.log(product_in_cart);
    cost_lst.getItemSubtotalCost();
    showCart();
    updateCost();
}