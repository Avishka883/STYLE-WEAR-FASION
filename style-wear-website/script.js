// STYLE WEAR FASHION - Interactive E-Commerce Logic

// Sample Catalog Data
const products = [
  // Men's Collection
  {
    id: 1,
    name: "Cyberpunk Oversized T-Shirt",
    category: "men",
    type: "T-Shirts",
    price: 89.00,
    desc: "Premium heavyweight cotton with futuristic metallic printed accents."
  },
  {
    id: 2,
    name: "Obsidian Tailored Formal Blazer",
    category: "men",
    type: "Formal Wear",
    price: 299.00,
    desc: "Precision-cut Italian wool blend featuring structured sharp shoulders."
  },
  {
    id: 3,
    name: "Neo-Tokyo Tactical Bomber Jacket",
    category: "men",
    type: "Jackets",
    price: 240.00,
    desc: "Weatherproof membrane jacket with modular utility pockets."
  },
  {
    id: 4,
    name: "Matrix Slim Fit Trousers",
    category: "men",
    type: "Trousers",
    price: 130.00,
    desc: "Flex-stretch woven fabric tailored for movement and comfort."
  },

  // Women's Collection
  {
    id: 5,
    name: "Aura Metallic Evening Gown",
    category: "women",
    type: "Dress",
    price: 350.00,
    desc: "Liquid chrome metallic fabric with a dramatic side slit and cowl neck."
  },
  {
    id: 6,
    name: "Valkyrie Leather Biker Jacket",
    category: "women",
    type: "Jackets",
    price: 280.00,
    desc: "Genuine matte grain leather with gold-embossed zippers."
  },
  {
    id: 7,
    name: "Minimalist Silk Satin Blouse",
    category: "women",
    type: "Tops & Blouses",
    price: 145.00,
    desc: "100% Mulberry silk blouse with French cuff detailing."
  },
  {
    id: 8,
    name: "High-Waist Sculpting Skirt",
    category: "women",
    type: "Skirts",
    price: 110.00,
    desc: "Architectural pleated design in structured neoprene."
  }
];

// State Management
let cart = [];
let selectedModalProduct = null;

// Initialize Page
document.addEventListener("DOMContentLoaded", () => {
  renderProducts(products);
  initCartEvents();
  init360Canvas();
  initAvatarControl();
});

// Render Product Grid
function renderProducts(items) {
  const grid = document.getElementById("product-grid");
  if (!grid) return;
  grid.innerHTML = items.map(p => `
    <div class="product-card">
      <div class="product-img-wrapper">
        <span class="product-badge">${p.category.toUpperCase()}</span>
        <div class="product-img-placeholder">&varr;</div>
      </div>
      <div class="product-info">
        <div class="product-category">${p.type}</div>
        <h3 class="product-title">${p.name}</h3>
        <div class="product-price">$${p.price.toFixed(2)}</div>
        <div class="product-actions">
          <button class="btn-sm" onclick="open360Modal(${p.id})">360° View</button>
          <button class="btn-sm" onclick="addToCart(${p.id})">Add to Bag</button>
        </div>
      </div>
    </div>
  `).join("");
}

// Category Filter
function filterCategory(cat) {
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
  if (window.event && window.event.target) {
    window.event.target.classList.add("active");
  }

  if (cat === "all") {
    renderProducts(products);
  } else {
    const filtered = products.filter(p => p.category === cat);
    renderProducts(filtered);
  }
}

// Shopping Cart Functions
function initCartEvents() {
  const cartBtn = document.getElementById("cart-btn");
  const closeCart = document.getElementById("close-cart");
  const cartDrawer = document.getElementById("cart-drawer");

  if (cartBtn) cartBtn.addEventListener("click", () => cartDrawer.classList.add("open"));
  if (closeCart) closeCart.addEventListener("click", () => cartDrawer.classList.remove("open"));

  const modalAdd = document.getElementById("modal-add-cart");
  if (modalAdd) {
    modalAdd.addEventListener("click", () => {
      if (selectedModalProduct) {
        addToCart(selectedModalProduct.id);
        document.getElementById("modal-360").classList.remove("open");
      }
    });
  }
}

function addToCart(productId) {
  const prod = products.find(p => p.id === productId);
  if (prod) {
    cart.push(prod);
    updateCartUI();
    document.getElementById("cart-drawer").classList.add("open");
  }
}

function updateCartUI() {
  const countEl = document.getElementById("cart-count");
  const container = document.getElementById("cart-items-container");
  const totalEl = document.getElementById("cart-total-price");

  if (countEl) countEl.innerText = cart.length;

  if (container) {
    container.innerHTML = cart.map((item, index) => `
      <div class="cart-item">
        <div>
          <h4>${item.name}</h4>
          <p>$${item.price.toFixed(2)}</p>
          <button onclick="removeFromCart(${index})" style="background:none; border:none; color:#ff4d4d; cursor:pointer; font-size:0.8rem;">Remove</button>
        </div>
      </div>
    `).join("");
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  if (totalEl) totalEl.innerText = `$${total.toFixed(2)}`;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

// 360 Degree View Interactive Canvas
function open360Modal(productId) {
  selectedModalProduct = products.find(p => p.id === productId);
  if (!selectedModalProduct) return;

  document.getElementById("modal-title").innerText = selectedModalProduct.name;
  document.getElementById("modal-price").innerText = `$${selectedModalProduct.price.toFixed(2)}`;
  document.getElementById("modal-desc").innerText = selectedModalProduct.desc;

  document.getElementById("modal-360").classList.add("open");
  draw360Simulation(0);
}

const close360Btn = document.getElementById("close-360");
if (close360Btn) {
  close360Btn.addEventListener("click", () => {
    document.getElementById("modal-360").classList.remove("open");
  });
}

let rotationAngle = 0;

function draw360Simulation(angle) {
  const canvas = document.getElementById("canvas-360");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);
  
  // Outer Wireframe Box
  ctx.strokeStyle = "rgba(212, 175, 55, 0.4)";
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, w - 40, h - 40);

  // Rotated Silhouette 3D mesh representation
  ctx.save();
  ctx.translate(w / 2, h / 2);
  
  const scaleX = Math.cos(angle);
  ctx.scale(scaleX, 1);

  // Draw 3D Mannequin torso representation
  ctx.fillStyle = "#d4af37";
  ctx.beginPath();
  ctx.ellipse(0, -60, 40, 20, 0, 0, Math.PI * 2); // Shoulders
  ctx.fill();

  ctx.fillRect(-30, -60, 60, 140); // Torso

  ctx.fillStyle = "#00f3ff";
  ctx.font = "14px Syne, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("STYLE WEAR 3D MESH", 0, 20);

  ctx.restore();
}

function init360Canvas() {
  const canvas = document.getElementById("canvas-360");
  if (!canvas) return;
  let isDragging = false;
  let startX = 0;

  canvas.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX;
  });

  window.addEventListener("mouseup", () => isDragging = false);

  canvas.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    rotationAngle += deltaX * 0.03;
    startX = e.clientX;
    draw360Simulation(rotationAngle);
  });
}

function initAvatarControl() {
  const heightSlider = document.getElementById("avatar-height");
  const heightVal = document.getElementById("height-val");
  const avatarBox = document.getElementById("avatar-box");

  if (heightSlider) {
    heightSlider.addEventListener("input", (e) => {
      const val = e.target.value;
      if (heightVal) heightVal.innerText = `${val} cm`;
      if (avatarBox) avatarBox.style.height = `${val * 1.5}px`;
    });
  }
}

function changePose(poseType) {
  const avatarBox = document.getElementById("avatar-box");
  document.querySelectorAll(".pose-btn").forEach(b => b.classList.remove("active"));
  if (window.event && window.event.target) {
    window.event.target.classList.add("active");
  }

  if (avatarBox) {
    if (poseType === 'runway') {
      avatarBox.style.borderRadius = "40px";
      avatarBox.style.transform = "rotate(0deg)";
    } else if (poseType === 'front') {
      avatarBox.style.borderRadius = "20px";
      avatarBox.style.transform = "scale(1.05)";
    } else {
      avatarBox.style.borderRadius = "50px 10px 50px 10px";
      avatarBox.style.transform = "rotate(5deg)";
    }
  }
}
