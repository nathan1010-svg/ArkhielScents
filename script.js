const modal = document.getElementById("imgModal");
const modalImg = document.getElementById("imgPreview");
const title = document.getElementById("modalTitle");
const desc = document.getElementById("modalDesc");
const price = document.getElementById("modalPrice");

const images = document.querySelectorAll(".product img");
const closeBtn = document.querySelector(".close");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

let currentIndex = 0;

// OPEN MODAL
function showImage(index) {
    const img = images[index];
    modal.style.display = "block";
    modalImg.src = img.src;
    title.innerText = img.dataset.name;
    desc.innerText = img.dataset.desc;
    price.innerText = img.dataset.price;
}

images.forEach((img, index) => {
    img.onclick = () => {
        currentIndex = index;
        showImage(currentIndex);
    }
});

// NEXT
nextBtn.onclick = () => {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
};

// PREV
prevBtn.onclick = () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
};

// CLOSE
closeBtn.onclick = () => modal.style.display = "none";

modal.onclick = (e) => {
    if (e.target === modal) modal.style.display = "none";
};

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartPanel = document.getElementById("cartPanel");

// ADD TO CART
document.querySelector(".buy-btn").onclick = function() {
    const name = document.getElementById("modalTitle").innerText;
    const price = parseInt(document.getElementById("modalPrice").innerText.replace("₱",""));

    const existing = cart.find(item => item.name === name);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ name, price, qty: 1 });
    }

    saveCart();
    updateCart();
};

// SAVE CART
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// UPDATE UI
function updateCart() {
    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const cartTotal = document.getElementById("cartTotal");

    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.qty;

        cartItems.innerHTML += `
            <div class="cart-item">
                <p><strong>${item.name}</strong></p>
                <p>₱${item.price} x ${item.qty}</p>

                <div class="cart-controls">
                    <button onclick="changeQty(${index}, -1)">-</button>
                    <button onclick="changeQty(${index}, 1)">+</button>
                    <button onclick="removeItem(${index})">❌</button>
                </div>
            </div>
        `;
    });

    cartCount.innerText = cart.reduce((sum, item) => sum + item.qty, 0);
    cartTotal.innerText = total;
}

// CHANGE QUANTITY
function changeQty(index, change) {
    cart[index].qty += change;

    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }

    saveCart();
    updateCart();
}

// REMOVE ITEM
function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    updateCart();
}

// TOGGLE CART (OPEN/CLOSE)
function toggleCart() {
    cartPanel.classList.toggle("active");
}

// CLOSE CART BUTTON
function closeCart() {
    cartPanel.classList.remove("active");
}

// LOAD CART ON START
updateCart();