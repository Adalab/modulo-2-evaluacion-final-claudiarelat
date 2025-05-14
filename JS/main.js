const list = document.querySelector(".js_ul");
list.classList.add("product_grid");

const buttonFind = document.querySelector(".js_button_find");
const inputFind = document.querySelector(".js_input_find");

const trolley = document.querySelector(".js_trolley");

let products = [];
let cart = [];

const url = "https://raw.githubusercontent.com/Adalab/resources/master/apis/products.json";

function renderItems(items, constant) {
    constant.innerHTML = ""; // Limpiar antes de renderizar

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
        price.textContent = item.price + " €"; 
        price.classList.add("product_price");

        const buyButton = document.createElement("button");
        buyButton.classList.add("button_find", "js_buy_button");
        buyButton.id = item.id;
        buyButton.textContent = "Comprar"; 

        li.appendChild(img);
        li.appendChild(title);
        li.appendChild(price);
        li.appendChild(buyButton);

        constant.appendChild(li);
    });
}

const handleFind = (event) => {
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
        renderItems(foundItems, list);
    }

}

function renderCart() {
  trolley.innerHTML = ""; // limpiar carrito

  if (cart.length === 0) {
    trolley.innerHTML = "<p>Carrito vacío</p>";
    return;
  }
  renderItems(cart, trolley); 
}

  

function addToCart(event) {
    console.log("click");
    event.preventDefault();

    const buttonClicked = event.target;

    // Solo actuar si el botón dice "Comprar"
    if (buttonClicked.textContent !== "Comprar") return;

    const buttonId = parseInt(buttonClicked.id);
    const productData = products.find(product => product.id === buttonId);

    const listItem = document.getElementById(buttonId);

    // Cambiar estilos permanentes
    buttonClicked.textContent = "Eliminar";
    buttonClicked.classList.add("button_added");
    listItem.classList.add("product_added");

    // Deshabilitar el botón para evitar que se haga clic nuevamente
    buttonClicked.disabled = true;

    // Añadir al carrito si no está
    if (!cart.find(item => item.id === productData.id)) {
        cart.push(productData);
    }

    renderCart(); // Renderiza el carrito sin alterar el estilo original
}



fetch(url)
    .then((response) => response.json())
    .then((data) => {
        products = data;
        // console.table(products);
        renderItems(products, list);
    })


buttonFind.addEventListener("click", handleFind);

const buttonBuy = document.querySelectorAll(".js_buy_button");
list.addEventListener("click", (event) => {
    if (event.target.classList.contains("js_buy_button")) {
        addToCart(event);
    }
});