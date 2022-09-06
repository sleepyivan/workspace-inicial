let product_code = window.localStorage.getItem("productID");
let product_info_url = PRODUCT_INFO_URL + product_code + ".json";
let product_comment_url = PRODUCT_INFO_COMMENTS_URL + product_code + ".json";

function updateNodeInnerText(node_id, text) {
    const node = document.getElementById(node_id);
    node.innerText = text;
}

function updateProductImages(imgs) {
    const node = document.getElementById("photo-gallery");

    for (let img_src of imgs) {
       node.innerHTML += `
       <a class="list-group-item list-group-item-action d-flex justify-content-between align-items-center w-25">
       <img src="${img_src}" alt="" class="img-fluid">
       </a>
       ` 
    }

}


async function showProductInfo() {
    const json = await getJSONData(product_info_url);
    const prod_info = json.data;
    updateNodeInnerText("prod-cat", prod_info.category); 
    updateNodeInnerText("prod-price", prod_info.currency + " " + prod_info.cost);
    updateNodeInnerText("prod-sold", prod_info.soldCount);
    updateNodeInnerText("prod-des", prod_info.description);
    console.log(json.data);
    updateProductImages(prod_info.images);
}

showProductInfo();