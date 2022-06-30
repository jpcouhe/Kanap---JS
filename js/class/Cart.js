class Cart {
    constructor() {
        let content = localStorage.getItem("basket");
        if (content == null) {
            this.content = {};
        } else {
            this.content = JSON.parse(content);
        }

        this.totalPrice = 0;
    }

    isEmpty() {
        if (Object.keys(this.content).length === 0) {
            return true;
        }
    }

    isExist(key) {
        if (this.content[key]) {
            return true;
        } else {
            return false;
        }
    }

    add(data) {
        let key = data.id + data.color;

        if (this.isExist(key)) {
            /* Adding the quantity of the product to the quantity of the product already in the cart. */
            this.content[key].quantity = parseInt(this.content[key].quantity) + parseInt(data.quantity);
            this.save();
        } else {
            /* Creating a new object in the content object. */
            this.content[key] = {
                id: data.id,
                color: data.color,
                quantity: data.quantity,
            };
            this.save();
        }
    }

    save() {
        localStorage.setItem("basket", JSON.stringify(this.content));
    }

    changeQuantity(article, element, price) {
        let myPrice = price;

        if (element.target.value > article.quantity) {
            this.totalPrice += myPrice;
        } else {
            this.totalPrice -= myPrice;
        }

        article.quantity = element.target.value;

        this.save();
        this.getTotalQuantity();
    }

    deleteProduct(key, price) {
        let myPrice = this.content[key].quantity * price;
        this.totalPrice -= myPrice;

        delete this.content[key];
        this.save();
        this.getTotalQuantity();
        if (this.isEmpty()) {
            location.reload();
        }
    }

    getTotalQuantity() {
        let totalQuantity = 0;
        for (const key in this.content) {
            totalQuantity += parseInt(this.content[key].quantity);
        }

        if (Object.keys(this.content).length != 0) {
            return totalQuantity;
        } else {
            return 0;
        }
    }

    getTotalPrice(price, quantity) {
        this.totalPrice += price * quantity;
    }
}
