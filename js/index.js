fetch("http://localhost:3000/api/products")
    /* Fetching the data from the API and converting it to JSON. */
    .then((response) => {
        /* This is checking if the response is ok. If it is, it will return the response as JSON. */
        if (response.ok) {
            return response.json();
        } else {
            let message = "Il y a une erreur dans le chargement des produits";
            throw new Error(response.status + " : " + message);
        }
    })
    .then((data) => {
        /* Creating the HTML elements for each product. */
        for (let i = 0; i < data.length; i++) {
            const productsContainer = document.getElementById("items");

            /* This is creating a link to the product page. */
            const productCard = document.createElement("a");
            productCard.setAttribute("href", "product.html?id=" + data[i]._id);

            /* Creating an HTML element called `article` and adding it to the DOM. */
            const productArticle = document.createElement("article");

            const productImage = document.createElement("img");
            productImage.src = data[i].imageUrl;
            productImage.setAttribute("alt", data[i].altTxt);
            productImage.setAttribute("name", data[i].name);

            const productName = document.createElement("h3");
            productName.classList.add("productName");
            productName.textContent = data[i].name;

            const productDescription = document.createElement("p");
            productDescription.classList.add("productDescription");
            productDescription.textContent = data[i].description;

            productsContainer.appendChild(productCard);
            productCard.appendChild(productArticle);
            productArticle.append(productImage, productName, productDescription);
        }
    })
    .catch((error) => {
        alert(error.message);
    });
