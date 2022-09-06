let product_code = window.localStorage.getItem("productID");
let product_info_url = PRODUCT_INFO_URL + product_code + ".json";
let product_comment_url = PRODUCT_INFO_COMMENTS_URL + product_code + ".json";

async function showProductInfo() {
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
           </a>`; 
        }
    }

    const json = await getJSONData(product_info_url);
    const prod_info = json.data;

    updateNodeInnerText("prod-name", prod_info.name); 
    updateNodeInnerText("prod-cat", prod_info.category); 
    updateNodeInnerText("prod-price", prod_info.currency + " " + prod_info.cost);
    updateNodeInnerText("prod-sold", prod_info.soldCount);
    updateNodeInnerText("prod-des", prod_info.description);
    
    updateProductImages(prod_info.images);
}

async function showProductComment() {
    function scoreToStars(score) {
        const valid_score = [0, 1, 2, 3, 4, 5];
        const is_score_valid = valid_score.some(value => value === score);
        let output_text = "";

        if (is_score_valid) {
            for (let star=1; star <= 5; star++) {
                if (star <= score) {
                    output_text +=`<span class="fa fa-star checked"></span>`;
                } else {
                    output_text +=`<span class="fa fa-star"></span>`;
                }
            }
        } else {
            output_text = `<span class="text-danger">Score Unvalid</span>`;
        }

        return output_text;
    }

    function showComment() {
        document.getElementById("comment-num").innerText = prod_comment.length;
        for (let comment of prod_comment) {
            node.innerHTML += `
            <li class="list-group-item">
              <p><span class="fw-bold">${comment.user}</span> - <span>${comment.dateTime}</span> - <span>${scoreToStars(comment.score)}</span></p>
              <p>${comment.description}</p>
            </li>`;
        }
    }

    const json = await getJSONData(product_comment_url);
    const prod_comment = json.data;
    const node = document.getElementById("prod-comment");
    
    if (prod_comment.length > 0) {
        showComment();
    } else {
        node.innerHTML = `<h4 class="text-muted text-center">No review yet. Let us know what do you think about the product!</h4>`;
    }

}

showProductInfo();
showProductComment();