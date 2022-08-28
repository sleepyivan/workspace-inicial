// let category_code = 101;
let category_code = window.localStorage.getItem("catID");
let product_url = PRODUCTS_URL + category_code + EXT_TYPE;

function updateCatName(txt) {
    const nodeCatName = document.getElementById("category_name");
    nodeCatName.innerText = txt;
}

function createCardHtml(product) {
    const p_id = product.id;

    const p_img = product.image;

    const p_name = product.name;
    const p_currency = product.currency;
    const p_cost = product.cost;

    const p_desc = product.description;
    const p_sold = product.soldCount;

    // const card_HtmlText = `
    return `
    <div class="list-group-item list-group-item-action" id="${p_id}" onclick="setProductId(this.id)">
          <div class="row">
            <div class="col-3">
              <img src="${p_img}" alt="product image" class="img-thumbnail">
            </div>
            <div class="col">
              <div class="d-flex w-100 justify-content-between">
                <div class="mb-1">
                  <h4 class="lead">${p_name} - ${p_currency} ${p_cost}</h4>
                  <p class="lead fs-6">${p_desc}</p>
                </div>
                <small class="text-muted">${p_sold} ventidos</small>
              </div>

            </div>
          </div>
        </div>
    `;
}

function setProductId(product_id) {
  localStorage.setItem("productID", product_id);
  window.location.href = "product-info.html";
}

async function showProductsList(url) {
    // console.log(url);
    const result = await getJSONData(url);
    const data = result.data;
    const products = data.products;
    // console.log(data);
    updateCatName(data.catName);

    const node_productlist = document.getElementById("product_list");
    products.forEach(product => {
        node_productlist.innerHTML += createCardHtml(product);
    });
}


showProductsList(product_url)