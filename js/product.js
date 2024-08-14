import handleAPIrequest from "./api.js";

const loadingmessage = $("#loading");
const errormsg = $("#error");
const productDetails = $("#product-details");
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');
function displayProductDetails(product) 
{
    productDetails.html(`
        <div class="border shadow rounded-2 mb-2 p-2">
            <img src="${product.images}" class="rounded mx-auto d-block mt-3 mb-3" alt="" style="width: 45%;">
            <div class="d-flex">
                <h3 style="text-align: center;color:rgb(211, 70, 34);margin-left:50px">${product.category}</h3>
            </div>
            <div class="d-flex">
                <h3 style="text-align: center;">${product.title}</h3>
                <h4 style="margin-left:900px">$${product.price}</h4>
            </div>
            <div class="d-flex mb-2" style="margin-left: 20px;">
                <i class="fa-solid fa-star" style="color: #FFD43B;"></i>
                <div class="rating rounded-2">
                    <p style="text-align: center;">${product.rating}</p>
                </div>
            </div>
            <p style="font-weight: bold;text-align: center;">${product.description}</p>
            <button style="margin-left:500px;width:350px;height:40px" class="add-btn mt-2 rounded-2" class="btn btn-primary" id="add-to-cart">Add to Cart</button>
        </div>
    `);

    document.getElementById('add-to-cart').addEventListener('click', function() {
        addToCart(product.id);
    });
}

function addToCart(productId) {
    console.log("Added product with ID:", productId);
}
handleAPIrequest(`products/${productId}`,
    function (data) {
        displayProductDetails(data);
    },
    function (e) {
        errormsg.removeClass("d-none");
        errormsg.addClass("d-flex");
        errormsg.find(".alert").text(e.message);
    },
    function () {
        loadingmessage.removeClass("d-none");
        loadingmessage.addClass("d-flex");
        console.log("loading");
    },
    function () {
        loadingmessage.removeClass("d-flex");
        loadingmessage.addClass("d-none");
        console.log("stop loading");
    }
);
