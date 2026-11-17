# Peekmart

Peekmart is a four-member group project for the JavaScript capstone. It is an online store where customers can browse products, manage a cart, enter delivery details, and review an order summary.

HTML, CSS, and vanilla JavaScript only are used with no frameworks or libraries added.

## Team

| Member | Name | Role |
|---|---|---|
| Member 1 | Abdulsamad Lukman | Products |
| Member 2 | Praise Dosumu| Cart |
| Member 3 | James Lucas | Checkout |
| Member 4 | Yusuf Adeniji | Integration and Summary |

## Run the project

Open the `peekmart` folder in VS Code and run `index.html` with Live Server. Use a local web server to allow the app to fetch products from the API and `products.json`.

## Shared data shapes

**Product**

```js
{ id: 1, title: "Phone", price: 499, category: "smartphones", thumbnail: "url", stock: 20 }
```

**Cart item**

```js
{ id: 1, title: "Phone", price: 499, quantity: 2 }
```

**Order**

```js
{ orderId: "ORD-1001", customer: { name, email, phone, address }, items: [...], total: 998, date: "..." }
```

See [COLLABORATION.md](./COLLABORATION.md) for each member's requirements, file ownership, and feature-branch instructions.
