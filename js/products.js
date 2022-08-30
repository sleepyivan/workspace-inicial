// let category_code = 101;
let category_code = window.localStorage.getItem("catID");
let product_url = PRODUCTS_URL + category_code + EXT_TYPE;
var products_data = [];
var products_array = [];

function updateCatName(txt) {
  const nodeCatName = document.getElementById("category_name");
  nodeCatName.innerText = txt;
}


function setProductId(product_id) {
  localStorage.setItem("productID", product_id);
  window.location.href = "product-info.html";
}

function showProductsList() {
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
  const node_productlist = document.getElementById("product_list");
  node_productlist.innerHTML = "";
  products_array.forEach(product => {
    node_productlist.innerHTML += createCardHtml(product);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  getJSONData(product_url).then(function (resultObj) {
    if (resultObj.status === "ok") {
      console.log(resultObj);
      updateCatName(resultObj.data.catName);
      products_data = resultObj.data.products;
      products_array = resultObj.data.products;
      
      showProductsList();
    }
  });

  document.getElementById("sort-by-price-inc").addEventListener("click", () => {
    products_array.sort(function(a, b){
      return a.cost - b.cost
    });
    showProductsList();
  });
  
  document.getElementById("sort-by-price-dec").addEventListener("click", () => {
    products_array.sort(function(a, b){
      return b.cost - a.cost
    });
    showProductsList();
  });
  
  document.getElementById("sort-by-rel-dec").addEventListener("click", () => {
    products_array.sort(function(a, b){
      return b.soldCount - a.soldCount
    })
    showProductsList();
  });

  document.getElementById("filter-go").addEventListener("click", () => {
    const min = () => {
      // invalid when min is negative
      if (document.getElementById("filter-range-min").value < 0 ) {
        document.getElementById("filter-range-min").value = "";
      }

      if (document.getElementById("filter-range-min").value === "") {
        return 0
      } else {
        return document.getElementById("filter-range-min").value
      }
    }
    
    const max = () => {
      // unvalid when max is negative or smaller than min
      if (document.getElementById("filter-range-max").value < document.getElementById("filter-range-min").value || document.getElementById("filter-range-max").value < 0) {
        document.getElementById("filter-range-max").value = "";
      }

      if (document.getElementById("filter-range-max").value === "") {
        return Infinity
      } else {
        return document.getElementById("filter-range-max").value
      }
    } 

    products_array = products_data.filter(product => {
      return product.cost >= min() && product.cost <= max()
    });

    showProductsList();
  });

  document.getElementById("filter-reset").addEventListener("click", () => {
    document.getElementById("filter-range-min").value = "";
    document.getElementById("filter-range-max").value = "";

    products_array = products_data;
    showProductsList();
  });

});



