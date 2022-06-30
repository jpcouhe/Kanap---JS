/* Creating a new instance of the Cart class. */
let cart = new Cart();

// ----------------------------------------------------------------------------------
/* Checking if the cart is empty and if it is, it will display a message and hide the form. */
if (cart.isEmpty()) {
    document.title = "Votre panier est vide";
    const sectionCardItems = document.getElementById("cart__items");
    const textIfCardEmpty = document.createElement("p");
    const form = document.querySelector(".cart__order__form");
    textIfCardEmpty.textContent = "Votre panier est vide.";
    sectionCardItems.appendChild(textIfCardEmpty);
    form.style.display = "none";
    document.querySelector("#totalQuantity").textContent = 0;
    document.querySelector("#totalPrice").textContent = 0;
}
// ----------------------------------------------------------------------------------

for (const key in cart.content) {
    /* Getting the product id from the cart content. */
    let productId = cart.content[key].id;
    /* Getting the color of the product from the cart content. */
    let productColor = cart.content[key].color;

    fetch("http://localhost:3000/api/products/" + productId)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            let message = "Il y a une erreur dans le chargement des produits";
            throw new Error(message);
        })

        .then((data) => {
            displayProduct(productId, productColor, data);
            cart.getTotalPrice(data.price, cart.content[key].quantity);
            displayTotal();
        })
        .catch((e) => {
            alert(e.message);
        });
}

function displayProduct(id, colors, dataAPI) {
    const key = id + colors;

    /* The above code is creating a cart item for each product in the cart. */
    const cardsSection = document.getElementById("cart__items");

    const article = document.createElement("article");
    article.classList.add("cart__item");
    article.dataset.id = dataAPI._id;
    article.dataset.colors = colors;

    const articleImage = document.createElement("div");
    articleImage.classList.add("cart__item__img");

    const articleContent = document.createElement("div");
    articleContent.classList.add("cart__item__content");

    const productImg = document.createElement("img");
    productImg.setAttribute("src", dataAPI.imageUrl);
    productImg.setAttribute("alt", dataAPI.altTxt);

    const description = document.createElement("div");
    description.classList.add("cart__item__content__description");

    const descriptionName = document.createElement("h2");
    descriptionName.textContent = dataAPI.name;

    const descriptionColors = document.createElement("p");
    descriptionColors.textContent = colors;

    const descriptionPrice = document.createElement("p");
    descriptionPrice.textContent = dataAPI.price + "€";

    const settings = document.createElement("div");
    settings.classList.add("cart__item__content__settings");

    const settingQuantity = document.createElement("div");
    settingQuantity.classList.add("cart__item__content__settings__quantity");

    const settingDelete = document.createElement("div");
    settingDelete.classList.add("cart__item__content__settings__delete");

    const paragrapheQuantity = document.createElement("p");
    paragrapheQuantity.textContent = `Qté : `;

    const inputQuantity = document.createElement("input");
    inputQuantity.setAttribute("type", "number");
    inputQuantity.setAttribute("min", "1");
    inputQuantity.setAttribute("max", "100");
    inputQuantity.setAttribute("value", cart.content[key].quantity);
    inputQuantity.classList.add("itemQuantity");

    const btnDelete = document.createElement("p");
    btnDelete.textContent = "Supprimer";
    btnDelete.classList.add("deleteItem");

    /* Creating the HTML structure of the cart. */
    cardsSection.appendChild(article);
    article.append(articleImage, articleContent);
    articleImage.appendChild(productImg);
    articleContent.append(description, settings);
    description.append(descriptionName, descriptionColors, descriptionPrice);
    settings.append(settingQuantity, settingDelete);
    settingQuantity.append(paragrapheQuantity, inputQuantity);
    settingDelete.appendChild(btnDelete);
    // ----------------------------------------------------------------------------------
    // ----------------------------------------------------------------------------------
    /* Adding an event listener to the input field. */
    inputQuantity.addEventListener("change", (element) => {
        if (element.target.value <= 0) {
            removeItem(element, dataAPI.price);
        } else {
            cart.changeQuantity(cart.content[key], element, dataAPI.price);
        }
        cart.save();
        displayTotal();
    });

    /* Removing the item from the cart. */
    btnDelete.addEventListener("click", (element) => {
        removeItem(element, dataAPI.price);
        displayTotal();
    });
}

// The function displays the total quantity and total price of the cart
function displayTotal() {
    document.querySelector("#totalQuantity").innerHTML = cart.getTotalQuantity();
    document.querySelector("#totalPrice").innerHTML = cart.totalPrice;
}

//Remove the item from the shopping cart
function removeItem(element, price) {
    let colorsElementToRemove = element.target.closest("article").dataset.colors;
    let idElementToRemove = element.target.closest("article").dataset.id;
    let key = idElementToRemove + colorsElementToRemove;
    cart.deleteProduct(key, price);
    element.target.closest("article").remove();
}

// -------------------------------FORMULARY ------------------------------
// -----------------------------------------------------------------------
// -----------------------------CheckValidity-----------------------------

const lastName = document.getElementById("lastName");
const firstName = document.getElementById("firstName");
const email = document.getElementById("email");
const city = document.getElementById("city");
const address = document.getElementById("address");
const orderForm = document.getElementById("order");
const form = document.querySelector("form");
// creating a regexp and listening changing event on each inputs
// ------------------------------------------------------------------------

let textRegExp = new RegExp("^[a-zA-Z- áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒs]+$", "i");
let addressRegExp = new RegExp(
    "^[-a-zA-Z0-9éáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒs']+$",
    "i"
);
let villeRegExp = new RegExp("[0-9]{5} [a-zA-Z-]{2,10}$", "i");
let emailRegExp = new RegExp("^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$", "i");

form.lastName.addEventListener("change", (e) => {
    isInputValid(textRegExp, lastName, "Ce champ doit contenir au minimum 2 lettres et pas de chiffre");
});

form.firstName.addEventListener("change", (e) =>
    isInputValid(textRegExp, firstName, "Ce champ doit contenir au minimum 2 lettres et pas de chiffre")
);
form.email.addEventListener("change", (e) =>
    isInputValid(emailRegExp, email, "L'adresse email n'est pas correct! (exemple@test.com)")
);
form.city.addEventListener("change", (e) =>
    isInputValid(
        villeRegExp,
        city,
        "Veuillez remplir sous la forme code postal puis la Ville ex : 45000 Orleans"
    )
);

form.address.addEventListener("change", (e) =>
    isInputValid(addressRegExp, address, "Ce champ ne doit pas contenir de caractères spéciaux sauf - et '")
);

// If the input matches the regular expression and is not empty, clear the error message.
// Otherwise, display the error message

function isInputValid(regExp, input, errorMessage) {
    if (regExp.test(input.value) && input.value !== "") {
        input.nextElementSibling.textContent = "";
        return true;
    } else {
        input.nextElementSibling.textContent = errorMessage;
        return false;
    }
}

// ----------------Sending the order to the server-----------------------

form.addEventListener("submit", function (e) {
    e.preventDefault();
    let result = isInputValid(
        textRegExp,
        lastName,
        "Ce champ doit contenir au minimum 2 lettres et pas de chiffre"
    );
    result =
        isInputValid(
            textRegExp,
            firstName,
            "Ce champ doit contenir au minimum 2 lettres et pas de chiffre"
        ) && result;

    result =
        isInputValid(emailRegExp, email, "L'adresse email n'est pas correct! (exemple@test.com)") && result;

    console.log(result);
    result =
        isInputValid(villeRegExp, city, "Ce champ doit contenir au minimum 2 lettres et pas de chiffre") &&
        result;

    result =
        isInputValid(
            addressRegExp,
            address,
            "Ce champ ne doit pas contenir de caractères spéciaux sauf - et '"
        ) && result;

    if (result) {
        const contact = {
            firstName: form.firstName.value,
            lastName: form.lastName.value,
            address: form.address.value,
            city: form.city.value,
            email: form.email.value,
        };

        let products = [];
        for (const key in cart.content) {
            let productId = cart.content[key].id;
            products.push(productId);
        }

        /* The above code is sending the information to the server. */
        const informationToSendToTheServer = {
            contact: contact,
            products: products,
        };

        /* The above code is sending the information to the server. */
        fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },

            body: JSON.stringify(informationToSendToTheServer),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(response.status + " : La page que vous demandez n'existe pas");
            })
            .then((data) => {
                localStorage.setItem("orderId", data.orderId);
                document.location.href = "confirmation.html";
            })
            .catch((error) => {
                alert(error.message);
            });
    } else {
        alert("Veuillez remplir correctement le formulaire de commande");
    }
});
