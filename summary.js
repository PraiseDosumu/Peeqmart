export function renderOrderSummary(order) {
  const orderId = document.getElementById("order-id");
  const customerSummary = document.getElementById("customer-summary");
  const orderItems = document.getElementById("order-items");
  const orderTotal = document.getElementById("order-total");

  if (!orderId || !customerSummary || !orderItems || !orderTotal) {
    throw new Error("Order summary elements are missing from the page.");
  }

  orderId.textContent = order.orderId;
  customerSummary.replaceChildren();

  [order.customer.name, order.customer.email, order.customer.phone, order.customer.address]
    .forEach((value, index) => {
      const line = document.createElement("p");
      line.textContent = value;

      if (index === 0) {
        const name = document.createElement("strong");
        name.textContent = value;
        line.replaceChildren(name);
      }

      customerSummary.append(line);
    });

  orderItems.replaceChildren();
  order.items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "order-item";

    const details = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = item.title;

    const quantity = document.createElement("p");
    quantity.textContent = `Qty: ${item.quantity}`;
    details.append(title, quantity);

    const lineTotal = document.createElement("span");
    lineTotal.textContent = formatCurrency(item.price * item.quantity);
    row.append(details, lineTotal);
    orderItems.append(row);
  });

  orderTotal.textContent = formatCurrency(order.total);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(Number(value));
}
