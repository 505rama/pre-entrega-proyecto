const cardsContainer = document.querySelector("#api-products");

console.log(cardsContainer);

if (cardsContainer) {
    console.log(cardsContainer);
}



const games = [];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartCount = document.querySelector("#cart-count");

const cartContainer = document.querySelector("#cart-container");

const cartSidebar = document.querySelector("#cart-container");
const cartItemsContainer = document.querySelector("#cart-items");
const cartTotalEl = document.querySelector("#cart-total");
const closeCartBtn = document.querySelector("#close-cart");
const cartIcon = document.querySelector("#cart-button");

cartIcon?.addEventListener("click", () => {
    cartSidebar.classList.add("open");
});

closeCartBtn?.addEventListener("click", () => {
    cartSidebar.classList.remove("open");
});

let index = 0;

const img = document.querySelector(".slide img");
const title = document.querySelector(".info h2");
const price = document.querySelector(".slide .price");
const sliderAddBtn = document.querySelector("#slider-add-btn");

const nextButton = document.querySelector(".next");
const prevButton = document.querySelector(".prev");

if (img && title && price && nextButton && prevButton) {

    nextButton.onclick = () => {
        if (games.length === 0) return;

        index = (index + 1) % games.length;
        update();
    };

    prevButton.onclick = () => {
        if (games.length === 0) return;

        index = (index - 1 + games.length) % games.length;
        update();
    };

    function update() {
        img.src = games[index].img;
        title.textContent = games[index].name;
        price.textContent = games[index].price;
    }

    window.update = update;
}

if (sliderAddBtn) {
    sliderAddBtn.addEventListener("click", () => {

        if (games.length === 0) return;

        addToCart(
            {
                name: games[index].name,
                img: games[index].img
            },
            games[index].price
        );

    });
}


const API_KEY = "bb7fd888d37a44e2ad665e42660c4e73";

function crearCard(game, precio) {

    if (!cardsContainer) return;

    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
        <img src="${game.background_image}" alt="${game.name}">

        <div class="card-content">
            <h3>${game.name}</h3>
            <p>${precio}</p>
            <button class="add-btn">Agregar al carrito</button>
        </div>
    `;

    const button = card.querySelector(".add-btn");

    button.addEventListener("click", () => {
    addToCart({
    name: game.name,
    img: game.background_image
}, precio);
});

    cardsContainer.appendChild(card);
}

function updateCartCounter() {
    if (!cartCount) return;

    const total = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartCount.textContent = total;
}

function addToCart(game, price) {
    console.log("AGREGANDO:", game);

    const existing = cart.find(item => item.name === game.name);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            name: game.name,
            img: game.img || game.background_image,
            price: price,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCounter();
    renderCart();
}

function renderCart() {
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = "";

    let total = 0;

    cart.forEach(item => {
    total += parseFloat(item.price.replace("$", "")) * item.quantity;

    cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <img src="${item.img}" />
                <div>
                    <p>${item.name}</p>
                    <p>${item.quantity} x ${item.price}</p>

                    <button onclick="changeQty('${item.name}', -1)">-</button>
                    <button onclick="changeQty('${item.name}', 1)">+</button>
                    <button onclick="removeItem('${item.name}')">X</button>
                </div>
            </div>
        `;
    });

    if (cartTotalEl) {
        cartTotalEl.textContent = "$" + total.toFixed(2);
    }
}

function changeQty(name, amount) {
    const item = cart.find(i => i.name === name);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(i => i.name !== name);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    renderCart();
    updateCartCounter();
}

function cargarJuegos() {

    fetch(`https://api.rawg.io/api/games?key=${API_KEY}&page_size=10`)
        .then(response => response.json())
        .then(data => {

            console.log(data.results);

            data.results.forEach(game => {

                const precio = "$" + (Math.random() * 50 + 10).toFixed(2);

                games.push({
                    name: game.name,
                    img: game.background_image,
                    price: precio
                });

                crearCard(game, precio);

            });

            if (window.update) {
                window.update();
            }

            updateCartCounter();
        })
        .catch(error => console.error(error));
        renderCart();
        updateCartCounter();

}

function removeItem(name) {
    cart = cart.filter(item => item.name !== name);

    localStorage.setItem("cart", JSON.stringify(cart));

    renderCart();
    updateCartCounter();
}

cargarJuegos();
