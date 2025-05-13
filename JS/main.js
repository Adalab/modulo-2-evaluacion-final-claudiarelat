const list = document.querySelector(".js_ul");
list.classList.add("product_grid");
let items = [];

url = "https://raw.githubusercontent.com/Adalab/resources/master/apis/products.json";

function renderItems() {
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
        buyButton.classList.add("button_find");

        li.appendChild(img);
        li.appendChild(title);
        li.appendChild(price);
        li.appendChild(buyButton);

        list.appendChild(li);
        
    }) 
}

fetch(url)
    .then((response) => response.json())
    .then((data) => {
        items = data;
        console.table(items);
        renderItems();
    })