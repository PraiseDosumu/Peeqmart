export class Cart {
  constructor(items = []) {
    this.items = Array.isArray(items) ? items : [];
  }

  addItem(product) {
    const existing = this.items.find((item) => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
      return;
    }

    this.items.push({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
    });
  }

  removeItem(id) {
    this.items = this.items.filter((item) => item.id !== id);
  }

  updateQuantity(id, quantity) {
    const item = this.items.find((entry) => entry.id === id);
    const nextQuantity = Number(quantity);

    if (!item || !Number.isInteger(nextQuantity) || nextQuantity < 1) {
      return false;
    }

    item.quantity = nextQuantity;
    return true;
  }

  getTotal() {
    return this.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  getItemCount() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }
}

export function initializeCart({ cart, onCartChange }) {
  const badge = getRequiredElement("cart-count");
  const emptyMessage = getRequiredElement("cart-empty");
  const itemsList = getRequiredElement("cart-items");
  const total = getRequiredElement("cart-total");

  function renderCart() {
    const itemCount = cart.getItemCount();
    badge.textContent = String(itemCount);
    badge.setAttribute(
      "aria-label",
      `${itemCount} ${itemCount === 1 ? "item" : "items"}`
    );
    emptyMessage.hidden = cart.items.length > 0;
    itemsList.replaceChildren();

    cart.items.forEach((item) => {
      const row = document.createElement("article");
      row.className = "cart-item";

      const details = document.createElement("div");
      details.className = "cart-item-details";

      const title = document.createElement("h2");
      title.textContent = item.title;

      const price = document.createElement("p");
      price.textContent = `${formatCurrency(item.price)} each`;
      details.append(title, price);

      const actions = document.createElement("div");
      actions.className = "cart-item-actions";

      const quantity = document.createElement("input");
      quantity.className = "quantity-input";
      quantity.type = "number";
      quantity.min = "1";
      quantity.step = "1";
      quantity.value = String(item.quantity);
      quantity.setAttribute("aria-label", `Quantity for ${item.title}`);
      quantity.addEventListener("change", () => {
        if (!cart.updateQuantity(item.id, quantity.value)) {
          quantity.value = String(item.quantity);
          return;
        }

        onCartChange();
        renderCart();
      });

      const lineTotal = document.createElement("strong");
      lineTotal.textContent = formatCurrency(item.price * item.quantity);

      const removeButton = document.createElement("button");
      removeButton.className = "text-button";
      removeButton.type = "button";
      removeButton.textContent = "Remove";
      removeButton.addEventListener("click", () => {
        cart.removeItem(item.id);
        onCartChange();
        renderCart();
      });

      actions.append(quantity, lineTotal, removeButton);
      row.append(details, actions);
      itemsList.append(row);
    });

    total.textContent = formatCurrency(cart.getTotal());
  }

  renderCart();
  return renderCart;
}

function getRequiredElement(id) {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Required cart element #${id} is missing.`);
  }
  return element;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(value);
}
