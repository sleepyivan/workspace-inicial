// Entrega 3.2
// Haciendo uso del identificador guardado en el punto anterior, realiza la solicitud adecuada para obtener la información de dicho producto y preséntala en product-info.html
let product_code = window.localStorage.getItem("productID");

let product_info_url = PRODUCT_INFO_URL + product_code + ".json";
let product_review_url = PRODUCT_INFO_COMMENTS_URL + product_code + ".json";

var product_info = [];
var product_reviews = [];

// 
function showProductInfo() {
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

    updateNodeInnerText("prod-name", product_info.name); 
    updateNodeInnerText("prod-cat", product_info.category); 
    updateNodeInnerText("prod-price", product_info.currency + " " + product_info.cost);
    updateNodeInnerText("prod-sold", product_info.soldCount);
    updateNodeInnerText("prod-des", product_info.description);
    
    updateProductImages(product_info.images);
}


// Entrega 3.3
// Haz la solicitud necesaria para obtener la lista de comentarios de cada producto y muéstralos debajo de lo realizado en el punto anterior (con su puntuación, usuario y fecha).
function addReview(user_name, time, score, description) {
    function scoreNumToStars(score) {
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

    const node = document.getElementById("prod-review");

    node.innerHTML += `
    <li class="list-group-item">
        <p><span class="fw-bold">${user_name}</span> - <span>${time}</span> - <span>${scoreNumToStars(score)}</span></p>
        <p>${description}</p>
    </li>`;
}

function updateReviewNumber(num) {
    document.getElementById("review-num").innerText = num;
}

function showProductReviews() {
    if (product_reviews.length > 0) {
        updateReviewNumber(product_reviews.length);
        for (let review of product_reviews) {
            addReview(review.user, review.dateTime, review.score, review.description)
        }
    } else {
        document.getElementById("prod-review").innerHTML = `<h4 class="text-muted text-center">No review yet. Let us know what do you think about the product!</h4>`;
    }

}

// Add Lisstener to document
document.addEventListener("DOMContentLoaded", () => {
    getJSONData(product_info_url).then(result => {
        product_info = result.data;
        showProductInfo();
    });

    getJSONData(product_review_url).then(result => {
        product_reviews = result.data;
        showProductReviews();
    })

    
})

// Entrega 4.4 y Desafiate add new review
// Agrega los controles gráficos necesarios para poder realizar un nuevo comentario con su puntuación (no se implementará el envío al servidor).
document.getElementById("new-comment").addEventListener("submit", event => {
    event.preventDefault();
})

function postReview(review) {
    let user = "";
    if (sessionStorage.getItem("LOGGEDIN.ACCOUNT") === null){
        user = "Anonymity";
    } else {
        user = sessionStorage.getItem("LOGGEDIN.ACCOUNT");
    }
    const now = new Date();
    const time = `${now.getFullYear()}-${now.getMonth()}-${now.getDay()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    const score = Number(review.score.value);
    const comment = review.comment.value;
    
    addReview(user, time, score, comment);
    updateReviewNumber(document.getElementById("prod-review").childElementCount);
}