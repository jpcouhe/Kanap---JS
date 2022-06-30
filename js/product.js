/* Getting the product id from the url. */
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const product = urlParams.get("id");

/* Fetching the product with the id that is in the url. */
fetch("http://localhost:3000/api/products/" + product)
    .then((response) => {
        if (response.ok) {
            return response.json();
        }
        let message = "Le produit est introuvable ";
        throw new Error(response.status + " : " + message);
    })
    .then((data) => {
        displayProduct(data);
    })
    .catch((e) => {
        alert(e);
    });

function displayProduct(data) {
    const imageContainer = document.querySelector(".item__img");
    const titleProduct = document.getElementById("title");
    const priceProduct = document.getElementById("price");
    const descriptionProduct = document.getElementById("description");
    const inputColors = document.getElementById("colors");
    const inputQuantity = document.getElementById("quantity");

    /* Setting the title of the page to the name of the product. */
    document.title = data.name;
    /* Creating an image with the src of the imageUrl and the alt of the name of the product. */
    const imageProduct = document.createElement("img");
    imageProduct.setAttribute("src", data.imageUrl);
    imageProduct.setAttribute("alt", "Photographie d'un canapé");
    imageContainer.appendChild(imageProduct);
    /* Setting the text content of the title, description and price of the product. */
    titleProduct.textContent = data.name;
    descriptionProduct.textContent = data.description;
    priceProduct.textContent = data.price;

    /* It's creating an option for each color of the product. */
    for (let i = 0; i < data.colors.length; i++) {
        const optionColors = document.createElement("option");
        optionColors.setAttribute("value", data.colors[i]);
        optionColors.textContent = data.colors[i];
        inputColors.appendChild(optionColors);
    }

    /* Setting the default value of the quantity to 1. */
    inputQuantity.value = 1;

    /* It's adding an event listener to the button. */
    const btnAddToCart = document.getElementById("addToCart");
    btnAddToCart.addEventListener("click", () => {
        /* It's creating a new instance of the Cart class. */
        let product = new Cart();
        if (checkColorAndQuantityValue() === true) {
            product.add({
                id: data._id,
                color: inputColors.value,
                quantity: inputQuantity.value,
            });
        }
    });
}

function checkColorAndQuantityValue() {
    const inputColors = document.getElementById("colors");
    const inputQuantity = document.getElementById("quantity");
    if (inputColors.value === "" && inputQuantity.value <= 0) {
        alert("Veuillez selectionner une couleur et une quantité");
        return false;
    }
    if (inputColors.value === "") {
        alert("Veuillez selectionner une couleur");
        return false;
    }
    if (inputQuantity.value <= 0) {
        alert("Veuillez selectionner une quantité ");
        return false;
    }
    return true;
}
