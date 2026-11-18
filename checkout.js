
export function initializeCheckout({ cart, onOrder }) {

    // get hold of the checkout form
    const checkoutForm = document.getElementById("checkout-form");

    // getting the inputs
    const nameInput = document.getElementById("customer-name");
    const emailInput = document.getElementById("customer-email");
    const phoneInput = document.getElementById("customer-phone");
    const addressInput = document.getElementById("customer-address");

    // selecting the error message elements from the html
    const nameError = document.getElementById("name-error");
    const emailError = document.getElementById("email-error");
    const phoneError = document.getElementById("phone-error");
    const addressError = document.getElementById("address-error");
    const checkoutError = document.getElementById("checkout-error");

    // to count the number of orders
    let orderNumber = 1;

    // form submission
    checkoutForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // removing old error messages
        nameError.textContent = "";
        emailError.textContent = "";
        phoneError.textContent = "";
        addressError.textContent = "";
        checkoutError.textContent = "";

        // check if cart is empty
        if (cart.items.length === 0) {
            checkoutError.textContent = "Your cart is empty. Please add items before checking out.";
            return;
        }

        // validate customer details
        if (nameInput.value.trim() === "") {
            nameError.textContent = "Please enter your name.";
        }

        if (!emailInput.value.trim().includes("@") || !emailInput.value.trim().includes(".")) {
            emailError.textContent = "Please enter a valid email address.";
        }

        const phone = phoneInput.value.trim();

        if (
            !phone.split("").every(char => char >= "0" && char <= "9") ||
            phone.length < 7 ||
            phone.length > 15
        ) {
            phoneError.textContent = "Enter 7–15 digits only.";
        }

        if (addressInput.value.trim() === "") {
            addressError.textContent = "Please enter your delivery address.";
        }

        // prevent checking out if errors occur
        if (
            nameError.textContent ||
            emailError.textContent ||
            phoneError.textContent ||
            addressError.textContent
        ) {
            return;
        }

        // order numbering
        const order = {
            orderId: "ORD-" + orderNumber,

            customer: {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                phone: phone,
                address: addressInput.value.trim()
            },

            items: cart.items.map(item => ({ ...item })),
            total: cart.getTotal(),
            date: new Date().toISOString()
        };

        // sending the order to the integration
        onOrder(order);

        orderNumber++;

    });
}
