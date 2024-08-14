import handleAPIrequest from "./api.js";

const categoriesContainer = $("#categories");
const productsitem = $("#products");
const container = $("#main-content");
const loadingmessage = $("#loading");
const errormsg = $("#error");
const cartproduct = $("#itemcart");
const cartbutton = document.getElementById('cart-btn');
const closebtn = document.getElementById('close-cart-btn');
const menu = document.getElementById('cartmenu');
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [];
let categories = [];
const apistates = {
    loading: true,
    err: null,
};

handleAPIrequest('products/categories', 
    function (data) {
        categories = data;
        container.removeClass("d-none");
        container.addClass("row");
        categoriesContainer.html(
            `
            <li><button id="category-all" class="category-btn" style="border: 0;background-color: white;"><a href="#" style="text-decoration: none;color: black">All Categories</a></button></li>
            ${data.map((category, index) =>
                `<li><button id="category-${index}" class="category-btn" data-category="${category.name}" style="border: 0;background-color: white;"><a href="#" style="text-decoration: none;color: black">${category.name}</a></button></li>`
            ).join('')}
            `
        );
        document.querySelectorAll('.category-btn').forEach(button => 
            button.addEventListener('click', function() {
                const category = this.dataset.category;
                if (category) {
                    filterByCategory(category);
                } else {
                    showAllProducts();
                }
            })
        );
    },
    function (e) {
        errormsg.removeClass("d-none");
        errormsg.addClass("d-flex");
        container.removeClass("row");
        container.addClass("d-none");
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

handleAPIrequest('products', 
    function (data) {
        products = data.products;
        container.removeClass("d-none");
        container.addClass("row");
        displayProducts(data.products);
    },
    function (e) {
        errormsg.removeClass("d-none");
        errormsg.addClass("d-flex");
        container.removeClass("row");
        container.addClass("d-none");
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

function displayProducts(products) {
    productsitem.html(
        products.map((product) =>
            `
            <div class="col-4">
                <div class="border shadow rounded-2 product-card" data-product-id="${product.id}">
                    <img src="${product.images}" class="rounded mx-auto d-block mt-3 mb-3" alt="" style="width: 80%;">
                    <h3 style="text-align: center;">${product.title}</h3>
                    <p style="font-weight: bold;text-align: center;">${product.description}</p>
                    <div class="d-flex mb-2" style="margin-left: 20px;">
                        <i class="fa-solid fa-star" style="color: #FFD43B;"></i>
                        <div class="rating rounded-2">
                            <p style="text-align: center;">${product.rating}</p>
                        </div>
                    </div>
                    <div class="d-flex justify-content-around">
                        <h1>$${product.price}</h1>
                        <button class="add-btn mt-2 rounded-2" data-product-id="${product.id}">Add to cart</button>
                    </div>
                </div>
            </div>
            `
        ).join('')
    );

    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function() {
            const productId = this.dataset.productId;
            window.location.href = `product.html?id=${productId}`;
        });
    });

    document.querySelectorAll('.add-btn').forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation();
            const productId = this.dataset.productId;
            console.log('Add to cart clicked with ID:', productId);
            addToCart(parseInt(productId));
        });
    });
}

function filterByCategory(category) {
    const filteredProducts = products.filter(product => product.category.toLowerCase() === category.toLowerCase());
    displayProducts(filteredProducts);
}

function showAllProducts() {
    displayProducts(products);
}

function showLoading() {
    document.getElementById('loading').classList.remove('d-none');
    document.getElementById('loading').classList.add('fade-in');
}

function hideLoading() {
    document.getElementById('loading').classList.remove('fade-in');
    document.getElementById('loading').classList.add('fade-out');
    setTimeout(() => document.getElementById('loading').classList.add('d-none'), 500);
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.count++;
        } else {
            cart.push({...product, count: 1});
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
    } else {
        console.log("Product not found:", productId);
    }
}

function displayCartItems() {
    cartproduct.html(
        cart.map((item, index) =>
            `
            <div class="cart-item border shadow rounded-2 mb-2 p-2 d-flex" data-product-id="${item.id}">
                <div>
                    <button class="close-btn-cart rounded-2" style="background-color: rgb(211, 70, 34);border:0px;"><i class="fa-solid fa-x" style="color: white;"></i></button>
                    <img src="${item.images}" class="rounded mx-auto d-block mt-3 mb-3 bg-white" alt="" style="width: 80%;height: 60%;">
                </div>
                <div>
                    <h5 style="text-align: center;">${item.title}</h5>
                    <p style="text-align: center;">${item.category}</p>
                    <div class="d-flex justify-content-center mt-3">
                        <h4>$${item.price}</h4>
                    </div>
                    <div class="d-flex" style="margin-left:15px;">
                        <div class="input-group-prepend">
                            <button class="btn bg-dark decrease-btn" data-product-id="${item.id}" style="width:50px;height:30px;"><i class="fa-solid fa-minus" style="color: grey;margin-right: 10px;"></i></button>
                        </div>
                        <input type="text" class="text-center rounded-2 count-input" data-product-id="${item.id}" style="width:150px;height:30px;" value="${item.count}">
                        <div class="input-group-append">
                            <button class="btn bg-dark increase-btn" data-product-id="${item.id}" style="width:50px;height:30px;"><i class="fa-solid fa-plus" style="color: grey;margin-right: 10px;"></i></button>
                        </div>
                    </div>
                    <h4 style="margin-left:70px;margin-top:20px">Total: $${item.price * item.count}</h4>
                </div>
            </div>
            `
        ).join('')
    );

    document.querySelectorAll('.increase-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.productId);
            increaseCount(productId);
        });
    });

    document.querySelectorAll('.decrease-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.productId);
            decreaseCount(productId);
        });
    });

    document.querySelectorAll('.close-btn-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.closest('.cart-item').dataset.productId);
            removeFromCart(productId);
        });
    });
}

function increaseCount(productId) {
    const product = cart.find(p => p.id === productId);
    if (product && product.count < product.stock) {
        product.count++;
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
    }
}

function decreaseCount(productId) {
    const product = cart.find(p => p.id === productId);
    if (product && product.count > 1) {
        product.count--;
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(p => p.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
}

$(document).ready(function () {
    container.addClass("d-none");
    loadingmessage.removeClass("d-none");
    loadingmessage.addClass("d-flex");
    handleAPIrequest('products', 
        function (data) {
            loadingmessage.removeClass("d-flex");
            loadingmessage.addClass("d-none");
            container.removeClass("d-none");
            container.addClass("row");
            displayProducts(data.products);
        },
        function (e) {
            errormsg.removeClass("d-none");
            errormsg.addClass("d-flex");
            loadingmessage.removeClass("d-flex");
            loadingmessage.addClass("d-none");
            container.removeClass("row");
            container.addClass("d-none");
            errormsg.html(
                `
                <div class="alert alert-danger">${e.message}</div>
                `
            );
        }
    );
    displayCartItems();
});

cartbutton.onclick = function () {
    menu.classList.toggle("open");
    displayCartItems();
}

closebtn.onclick = function () {
    menu.classList.remove("open");
}
document.getElementById('search-btn').addEventListener('click', function() {
    const query = document.getElementById('search').value.toLowerCase();
    console.log('Search query:', query);

    handleAPIrequest('products', 
        function (data) {
            const filteredProducts = data.products.filter(product => 
                product.title.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query)
            );
            displayProducts(filteredProducts);
        },
        function (e) {
            errormsg.removeClass("d-none");
            container.removeClass("row");
            container.addClass("d-none");
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
});

document.getElementById('search').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        document.getElementById('search-btn').click();
    }
});
