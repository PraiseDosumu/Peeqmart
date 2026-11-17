# Peekmart Team Collaboration

Use this guide to complete your assigned feature on its own branch. Run Git commands from inside the cloned `peekmart` repository. Keep the shared data shapes in [README.md](./README.md) consistent across all feature files.

The repository is already created on GitHub. Its `.gitignore` excludes the Stitch export and `group_project.md`.

## Clone the repository

Each member clones the shared repository once. From PowerShell, run:

```powershell
git clone https://github.com/Usefulmech/peeqmart.git
Set-Location peeqmart
```

Do not run `git init` or create another remote. After cloning, create your feature branch from the latest `main` branch as described below.

## Feature ownership and requirements

### Member 1 — Products

**Branch:** `feature/products`  
**Files:** `products.js`, `products.json`

- Fetch up to 20 products from `https://dummyjson.com/products?limit=20`.
- Check `response.ok`; show a loading message and a friendly error message.
- Keep product data in `products.json` and use it when the API is unavailable.
- Dynamically render product cards with an image, title, price, and Add to Cart button.
- Filter products by title as the user types and by the selected category.
- Use `filter()` and `map()` to build the displayed product list.

### Member 2 — Cart

**Branch:** `feature/cart`  
**File:** `cart.js`

- Implement a `Cart` class with `addItem()`, `removeItem()`, `updateQuantity()`, `getTotal()`, and `getItemCount()`.
- Increase an existing item's quantity instead of adding a duplicate.
- Use `reduce()` to calculate the total.
- Display each item, its quantity, line total, and a Remove button.
- Update the header cart badge and display “Your cart is empty” when appropriate.

### Member 3 — Checkout

**Branch:** `feature/checkout`  
**File:** `checkout.js`

- Provide name, email, phone, and delivery-address fields.
- Reject empty values, invalid email addresses, and phone numbers that contain anything other than digits or have an unreasonable length.
- Show an error message below each invalid field; do not use `alert()` for validation.
- Block checkout when the cart is empty.
- On valid submission, create an order using the README data shape and pass it to the summary.

### Member 4 — Integration and Summary

**Branch:** `feature/integration-summary`  
**Files:** `main.js`, `summary.js`, `index.html`

- Display the order ID, customer details, purchased items, and total on the summary screen.
- Save the cart and latest order in `localStorage`; restore the cart after a page refresh.
- Connect products, cart, checkout, and summary.
- Implement navigation between Products, Cart, Checkout, and Summary.
- Make Continue Shopping clear the cart and return to the product list.
- Keep the page layout responsive and test the complete customer flow.
- Own changes to `main.js` and `index.html`. Have other members request changes to those files rather than editing them directly.
- Coordinate cart persistence with Member 2 and shared styling changes with the team.

#### JavaScript integration interface

The integration files expect these module exports so each feature can be developed on its own branch:

- `products.js` exports `initializeProducts({ onAddToCart })`. It loads and renders the catalog and calls `onAddToCart(product)` when a customer adds a product. The function returns a promise.
- `cart.js` exports `Cart` and `initializeCart({ cart, onCartChange })`. `Cart.items` contains cart items and the class implements the methods listed in Member 2's requirements. `initializeCart` owns the cart panel and badge, calls `onCartChange()` after user changes, and returns a function that refreshes the panel after changes made by other modules.
- `checkout.js` exports `initializeCheckout({ cart, onOrder })`. It owns checkout validation and calls `onOrder(order)` only after a valid submission.

### All members

- Make the interface work on phone and desktop widths.
- Display all product, cart, and order prices in Nigerian naira (NGN).
- Remove unused code and all `console.log` statements before merging.
- Keep feature code in the files assigned above and use the shared data shapes.

## Branch instructions for each member

Create your feature branch from the latest `main` the first time you start work. On later sessions, switch to your existing branch and pull its latest remote changes. Commit and push only your feature files, then open a pull request from your feature branch to `main`.

When a teammate's pull request is merged into `main`, update your feature branch with the new `main`:

```bash
git fetch origin
git switch main
git pull --ff-only origin main
git switch feature/<your-branch>
git merge main
git push
```

### Member 1 — Products

Create `feature/products` the first time:

```bash
git switch main
git pull --ff-only origin main
git switch -c feature/products
```

For later sessions:

```bash
git switch feature/products
git pull --ff-only origin feature/products
```

Commit and push your work:

```bash
git add -- products.js products.json
git commit -m "Build product listing"
git push -u origin feature/products
```

### Member 2 — Cart

Create `feature/cart` the first time:

```bash
git switch main
git pull --ff-only origin main
git switch -c feature/cart
```

For later sessions:

```bash
git switch feature/cart
git pull --ff-only origin feature/cart
```

Commit and push your work:

```bash
git add -- cart.js
git commit -m "Build shopping cart"
git push -u origin feature/cart
```

### Member 3 — Checkout

Create `feature/checkout` the first time:

```bash
git switch main
git pull --ff-only origin main
git switch -c feature/checkout
```

For later sessions:

```bash
git switch feature/checkout
git pull --ff-only origin feature/checkout
```

Commit and push your work:

```bash
git add -- checkout.js
git commit -m "Build checkout form"
git push -u origin feature/checkout
```

### Member 4 — Integration and Summary

Create `feature/integration-summary` the first time:

```bash
git switch main
git pull --ff-only origin main
git switch -c feature/integration-summary
```

For later sessions:

```bash
git switch feature/integration-summary
git pull --ff-only origin feature/integration-summary
```

Commit and push your work:

```bash
git add -- main.js summary.js index.html
git commit -m "Integrate marketplace and order summary"
git push -u origin feature/integration-summary
```

### Before pushing updates

Run these commands while on your feature branch:

```bash
git status
git add -- <your-owned-files>
git commit -m "Describe your feature change"
git push
```

Run these commands from the `peekmart` folder. Add only the files assigned to your role. Open a pull request to `main` after pushing. Do not include another member's unfinished feature files in your commit.
