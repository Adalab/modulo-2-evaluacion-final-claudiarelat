const list = document.querySelector(".js_ul");
list.classList.add("product_grid");

const buttonFind = document.querySelector(".js_button_find");
const inputFind = document.querySelector(".js_input_find");



let products = [];

url = "https://raw.githubusercontent.com/Adalab/resources/master/apis/products.json";

function renderItems(items) {
    items.forEach((item) => {
        const li = document.createElement("li");
        li.id = item.id;
        li.classList.add("product");

        const img = document.createElement("img");
        img.src = item.image; 
        img.alt = item.title;
        img.classList.add("product_image");
        
        const title = document.createElement("h4");
        title.textContent = item.title; 
        title.classList.add("product_h4");

        const price = document.createElement("p");
        price.textContent = item.price; 
        price.classList.add("product_price");

        const buyButton = document.createElement("button");
        buyButton.textContent = "Comprar";
        buyButton.classList.add("button_find", "js_buy_button");
        buyButton.id = item.id; 

        li.appendChild(img);
        li.appendChild(title);
        li.appendChild(price);
        li.appendChild(buyButton);

        list.appendChild(li);
        
    }) 
}

handleFind = (event) => {
    event.preventDefault();
    const inputValue = inputFind.value.toLowerCase().trim();

    const foundItems = products.filter((product) => {
    return product.title.toLowerCase().trim().includes(inputValue);
    });

    list.innerHTML = ""; 
    if (foundItems.length === 0) {
        const li = document.createElement("li");
        li.textContent = "No hay resultados";
        li.classList.add("product");
        list.appendChild(li);
    }
    else {
        renderItems(foundItems);
    }

}


function addToCart(event) {
    event.preventDefault();

    const buttonClicked = event.target;
    const buttonId = buttonClicked.id;
    const listItem = document.getElementById(buttonId);

    if (!listItem) {
        console.error("No matching list item found for ID:", buttonId);
        return;
    }

    // Toggle product styling
    listItem.classList.toggle("product_added");
    listItem.classList.toggle("product");

    // Toggle button styling
    if (buttonClicked.textContent === "Comprar") {
        buttonClicked.textContent = "Eliminar";
        buttonClicked.classList.remove("button_find");
        buttonClicked.classList.add("button_added");
    } else {
        buttonClicked.textContent = "Comprar";
        buttonClicked.classList.remove("button_added");
        buttonClicked.classList.add("button_find");
    }
}

fetch(url)
    .then((response) => response.json())
    .then((data) => {
        products = data;
        console.table(products);
        renderItems(products);
    })


buttonFind.addEventListener("click", handleFind);

const buttonBuy = document.querySelectorAll(".js_buy_button");
list.addEventListener("click", (event) => {
    if (event.target.classList.contains("js_buy_button")) {
        addToCart(event);
    }
});


