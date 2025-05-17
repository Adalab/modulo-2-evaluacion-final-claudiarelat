
'use strict'; 

//Constantes y variables 
const list = document.querySelector(".js_ul");
list.classList.add("product_grid");

const buttonFind = document.querySelector(".js_button_find");
const inputFind = document.querySelector(".js_input_find");

// const buttonBuy = document.querySelectorAll(".js_buy_button");

const trolley = document.querySelector(".js_trolley");
const buttonClear = document.querySelector(".js_clear_button")

let products = [];
let cart = [];

const url = "https://raw.githubusercontent.com/Adalab/resources/master/apis/products.json";


// Fetch y almacenamiento local 
if (localStorage.getItem("products") === null) {
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            products = data;
            localStorage.setItem("products", JSON.stringify(products));

            
            if (localStorage.getItem("cart")) {
                cart = JSON.parse(localStorage.getItem("cart"));
                renderCart();
            }

            renderItems(products, list);
        });
} else {
    products = JSON.parse(localStorage.getItem("products"));

    
    if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
        renderCart();
    }

    renderItems(products, list); 
}


//Funciones 

function renderItems(items, constant, isCart = false) {
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

        li.appendChild(img);
        li.appendChild(title);
        li.appendChild(price);

        // if (isCart) {
        //     li.classList.add("cart-item");
        // }

        // Si estamos renderizando el carrito, no añadimos el botón ni los estilos "product_added"
        if (!isCart) {
            const buyButton = document.createElement("button");
            buyButton.classList.add("button_find", "js_buy_button");
            buyButton.id = item.id;

            // Verificar si ya está en el carrito
            const isInCart = cart.find(product => product.id === item.id);
            if (isInCart) {
                buyButton.textContent = "Eliminar";
                buyButton.classList.add("button_added");
                li.classList.add("product_added");
            } else {
                buyButton.textContent = "Comprar";
            }
        

            li.appendChild(buyButton);
        }

        

        constant.appendChild(li);
    });
}



const handleFind = (event) => {
    
    list.innerHTML = ""; 
    event.preventDefault();
    
    const inputValue = inputFind.value.toLowerCase().trim();

    const foundItems = products.filter((product) => {
        return product.title.toLowerCase().trim().includes(inputValue);
    });

    // list.innerHTML = ""; 
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
    trolley.innerHTML = "<p>It is empty</p>";
    return;
  }
  renderItems(cart, trolley, true); 
}

  
function addToCart(event) {
    event.preventDefault();

    const buttonClicked = event.target;
    const buttonId = parseInt(buttonClicked.id);
    const productData = products.find(product => product.id === buttonId);


    const listItem = document.getElementById(buttonId);


    if (buttonClicked.textContent === "Comprar") {
        buttonClicked.textContent = "Eliminar";
        buttonClicked.classList.add("button_added");
        listItem.classList.add("product_added");

        // Add to cart if not already there
        if (!cart.find(item => item.id === productData.id)) {
            cart.push(productData);
        }
    } else {
        buttonClicked.textContent = "Comprar";
        buttonClicked.classList.remove("button_added");
        listItem.classList.remove("product_added");

        // Remove from cart
        cart = cart.filter(item => item.id !== productData.id);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    renderCart();
    renderItems(products, list); 
}

function handleClear(event) {
    event.preventDefault();
    
    // Empty the cart
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Re-render the cart (this will show the "It is empty" message)
    renderCart();
    
    // Re-render the product list to remove "product_added" styles and set buttons back to "Comprar"
    renderItems(products, list);
};


//Eventos 
buttonFind.addEventListener("click", handleFind);


list.addEventListener("click", (event) => {
    if (event.target.classList.contains("js_buy_button")) {
        addToCart(event);
    }
});

buttonClear.addEventListener("click", handleClear);