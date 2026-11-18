import fallbackProducts from "./products.json";

const API_URL = "https://dummyjson.com/products?limit=20";

let allProducts = [];
let onAddToCartCallback = null;

function formatNGN(price) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(price);
}

function normalizeProduct(item) {
  return {
    id: item.id,
    title: item.title,
    price: item.price,
    category: item.category,
    thumbnail: item.thumbnail,
    stock: item.stock ?? 0,
  };
}

async function fetchProducts() {
  const loadingEl = document.getElementById("products-loading");
  const errorEl = document.getElementById("products-error");

  if (loadingEl) loadingEl.style.display = "block";
  if (errorEl) errorEl.style.display = "none";

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.products.map(normalizeProduct);
  } catch {
    if (errorEl) {
      errorEl.textContent =
        "Could not load products from the server. Showing saved products instead.";
      errorEl.style.display = "block";
    }
    return fallbackProducts.map(normalizeProduct);
  } finally {
    if (loadingEl) loadingEl.style.display = "none";
  }
}

function getCategories(products) {
  const unique = [...new Set(products.map((p) => p.category))];
  return unique.sort();
}

function filterProducts(products, searchText, selectedCategory) {
  return products
    .filter((p) =>
      selectedCategory === "all" ? true : p.category === selectedCategory
    )
    .filter((p) =>
      p.title.toLowerCase().includes(searchText.toLowerCase().trim())
    );
}

function renderProducts(products) {
  const grid = document.getElementById("products-grid");
  if (!grid) return;

  if (products.length === 0) {
    grid.innerHTML = `<p class="products-empty">No products match your search.</p>`;
    return;
  }

  grid.innerHTML = products
    .map(
      (product) => `
      <div class="product-card" data-id="${product.id}">
        <img
          src="${product.thumbnail}"
          alt="${product.title}"
          class="product-thumbnail"
          loading="lazy"
        />
        <div class="product-info">
          <h3 class="product-title">${product.title}</h3>
          <p class="product-category">${product.category}</p>
          <p class="product-price">${formatNGN(product.price)}</p>
          <button
            class="btn-add-to-cart"
            data-id="${product.id}"
            ${product.stock === 0 ? "disabled" : ""}
          >
            ${product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    `
    )
    .join("");

  grid.querySelectorAll(".btn-add-to-cart:not([disabled])").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const product = allProducts.find((p) => p.id === id);
      if (product && onAddToCartCallback) {
        onAddToCartCallback(product);
      }
    });
  });
}

function renderCategoryFilter(products) {
  const select = document.getElementById("category-filter");
  if (!select) return;

  const categories = getCategories(products);

  select.innerHTML =
    `<option value="all">All Categories</option>` +
    categories
      .map((cat) => `<option value="${cat}">${cat}</option>`)
      .join("");
}

function setupFilters() {
  const searchInput = document.getElementById("product-search");
  const categorySelect = document.getElementById("category-filter");

  function applyFilters() {
    const searchText = searchInput ? searchInput.value : "";
    const selectedCategory = categorySelect ? categorySelect.value : "all";
    const filtered = filterProducts(allProducts, searchText, selectedCategory);
    renderProducts(filtered);
  }

  if (searchInput) searchInput.addEventListener("input", applyFilters);
  if (categorySelect) categorySelect.addEventListener("change", applyFilters);
}

export async function initializeProducts({ onAddToCart }) {
  onAddToCartCallback = onAddToCart;

  allProducts = await fetchProducts();

  renderCategoryFilter(allProducts);
  renderProducts(allProducts);
  setupFilters();
}
