
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

function renderItems(items, container, isCart = false) {
  container.innerHTML = ""; // Clear before re-rendering

  items.forEach((item) => {
    const li = document.createElement("li");
    li.id = item.id;
    
    
    if (isCart) {
      li.classList.add("cart-item");
    } else {
      li.classList.add("product");
    }

    // Create and append the image element
    const img = document.createElement("img");
    img.src = item.image; 
    img.alt = item.title;
    img.classList.add("product_image");

    // Create a container for product details (name and price)
    const detailsContainer = document.createElement("div");
    detailsContainer.classList.add("cart-details");

    const title = document.createElement("h4");
    title.textContent = item.title;
    title.classList.add("product_h4");

    const price = document.createElement("p");
    price.textContent = item.price + " €"; 
    price.classList.add("product_price");

    detailsContainer.appendChild(title);
    detailsContainer.appendChild(price);

    li.appendChild(img);
    li.appendChild(detailsContainer);

    if (isCart) {
      // Create a container for quantity controls below the product details
      const quantityContainer = document.createElement("div");
      quantityContainer.classList.add("quantity-control");

      const minusButton = document.createElement("button");
      minusButton.textContent = "–";
      minusButton.classList.add("quantity-minus");
      minusButton.dataset.id = item.id;

      const countSpan = document.createElement("span");
      countSpan.textContent = item.quantity;
      countSpan.classList.add("quantity-count");

      const plusButton = document.createElement("button");
      plusButton.textContent = "+";
      plusButton.classList.add("quantity-plus");
      plusButton.dataset.id = item.id;

      quantityContainer.appendChild(minusButton);
      quantityContainer.appendChild(countSpan);
      quantityContainer.appendChild(plusButton);

      // Append the quantity controls after the details
      li.appendChild(quantityContainer);
    } else {
      
      const buyButton = document.createElement("button");
      buyButton.classList.add("button_find", "js_buy_button");
      buyButton.id = item.id;

      const isInCart = cart.find(product => product.id === item.id);
      if (isInCart) {
        buyButton.textContent = "Delete";
        buyButton.classList.add("button_added");
        li.classList.add("product_added");
      } else {
        buyButton.textContent = "Buy Now";
      }
      li.appendChild(buyButton);
    }

    container.appendChild(li);
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
        li.textContent = "No results";
        li.classList.add("empty");
        list.appendChild(li);
    }
    else {
        renderItems(foundItems, list);
    }
}

   
function renderCart() {
  trolley.innerHTML = ""; // limpiar carrito

  if (cart.length === 0) {
    // trolley.innerHTML = "<p>It is empty</p>";
    const vacio = document.createElement("p");
    vacio.textContent = "It is empty"
    vacio.classList.add("empty");
    trolley.appendChild(vacio);
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

  // Check if the product already exists in the cart
  const existingProduct = cart.find(item => item.id === productData.id);

  
  if (buttonClicked.textContent === "Buy Now") {
    if (!existingProduct) {
      productData.quantity = 1; 
      cart.push(productData);
      buttonClicked.textContent = "Delete";
      buttonClicked.classList.add("button_added");
      listItem.classList.add("product_added");
    }
    
  } else {
    // Remove the product entirely if the button shows "Eliminar"
    cart = cart.filter(item => item.id !== productData.id);
    buttonClicked.textContent = "Comprar";
    buttonClicked.classList.remove("button_added");
    listItem.classList.remove("product_added");
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

function updateQuantity(id, delta) {
  const product = cart.find(item => item.id === id);
  if (!product) return;

  product.quantity += delta;

  // Remove product if quantity falls to 0 or less
  if (product.quantity <= 0) {
    cart = cart.filter(item => item.id !== id);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart(); // Re-render the shopping cart, with updated quantity buttons.
  renderItems(products, list); // Also update the product list button states.
}


//Eventos 
buttonFind.addEventListener("click", handleFind);


list.addEventListener("click", (event) => {
    if (event.target.classList.contains("js_buy_button")) {
        addToCart(event);
    }
});

buttonClear.addEventListener("click", handleClear);


trolley.addEventListener("click", (event) => {
  const id = parseInt(event.target.dataset.id);

  if (event.target.classList.contains("quantity-plus")) {
    updateQuantity(id, 1);
  } else if (event.target.classList.contains("quantity-minus")) {
    updateQuantity(id, -1);
  }
});