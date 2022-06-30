const order = document.getElementById("orderId");
const orderNumber = localStorage.getItem("orderId");

/* Setting the text content of the element with id `orderId` to the value of the variable
`orderNumber`. */
order.textContent = orderNumber;

localStorage.clear();
