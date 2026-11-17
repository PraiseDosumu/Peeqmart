import { Cart, initializeCart } from "./cart.js";
import { initializeCheckout } from "./checkout.js";
import { initializeProducts } from "./products.js";
import { renderOrderSummary } from "./summary.js";

const CART_STORAGE_KEY = "peeqmart-cart";
const ORDER_STORAGE_KEY = "peeqmart-order";

const checkoutError = document.getElementById("checkout-error");
const productsError = document.getElementById("products-error");

function showError(message) {
  productsError.textContent = message;
  productsError.hidden = false;
}

function readStoredCart() {
  const savedCart = localStorage.getItem(CART_STORAGE_KEY);

  if (!savedCart) {
    return [];
  }

  try {
    const items = JSON.parse(savedCart);
    if (!Array.isArray(items)) {
      throw new TypeError("Saved cart data is not a list.");
    }
    return items;
  } catch (error) {
    showError("Your saved cart could not be restored. Start a new cart.");
    return [];
  }
}

function readStoredOrder() {
  const savedOrder = localStorage.getItem(ORDER_STORAGE_KEY);

  if (!savedOrder) {
    return null;
  }

  try {
    const order = JSON.parse(savedOrder);
    if (
      !order ||
      typeof order !== "object" ||
      typeof order.orderId !== "string" ||
      !order.customer ||
      typeof order.customer !== "object" ||
      !Array.isArray(order.items)
    ) {
      throw new TypeError("Saved order data is invalid.");
    }
    return order;
  } catch (error) {
    showError("The saved order summary could not be restored.");
    return null;
  }
}

const cart = new Cart(readStoredCart());

function persistCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart.items));
}

const refreshCart = initializeCart({
  cart,
  onCartChange: persistCart,
});

function clearCart() {
  cart.items.slice().forEach((item) => cart.removeItem(item.id));
  persistCart();
  refreshCart();
}

function showView(viewName) {
  document.querySelectorAll("[data-view-panel]").forEach((panel) => {
    panel.hidden = panel.dataset.viewPanel !== viewName;
  });

  document.querySelectorAll(".nav-button").forEach((button) => {
    const isCurrent = button.dataset.view === viewName;
    button.classList.toggle("is-current", isCurrent);

    if (isCurrent) {
      button.setAttribute("aria-current", "page");
    } else {
      button.removeAttribute("aria-current");
    }
  });
}

document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => {
    const targetView = button.dataset.view;

    if (targetView === "checkout" && cart.getItemCount() === 0) {
      checkoutError.textContent = "Your cart is empty. Add an item before checking out.";
      checkoutError.hidden = false;
      showView("cart");
      return;
    }

    if (targetView === "checkout") {
      checkoutError.textContent = "";
      checkoutError.hidden = true;
    }

    showView(targetView);
  });
});

document.getElementById("continue-shopping").addEventListener("click", () => {
  clearCart();
  showView("products");
});

initializeProducts({
  onAddToCart(product) {
    cart.addItem(product);
    persistCart();
    refreshCart();
    showView("cart");
  },
}).catch((error) => {
  showError(`Products could not be loaded: ${error.message}`);
});

initializeCheckout({
  cart,
  onOrder(order) {
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));
    renderOrderSummary(order);
    clearCart();
    showView("summary");
  },
});

const savedOrder = readStoredOrder();
if (savedOrder) {
  renderOrderSummary(savedOrder);
}

showView("products");
