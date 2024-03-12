const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModelBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addresWarn = document.getElementById("address-warm")

/* let cart = []; */

/* Arir o modal do carrinho */
cartBtn.addEventListener("click", function(){
    cartModal.style.display = "flex"
    updateCartModal();
    

})

/* Fechando o carrinho apertando fora do modal  */
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
    
})

// fechando o carrinho apertando no botao 
closeModelBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})


// adicionando ao carinho clicando no botao
menu.addEventListener("click", function(){

    // so vai ser adicionado se clicar no carinho ou proximo dele
    let parentButton = event.target.closest(".add-to-cart-btn")

    // vai para a condição de analise

    if(parentButton){
        //pegando o preço e o nome do item
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        // chamemos a função que recebe 2 paramentros

        addToCart(name, price)

    }
    
})

// função para adicionar ao carinho
// CRIANDO A LOGICA DO NOSSO CARRINHO
// Primeiro criaremos uma lista vazia 

let cart = [];

function addToCart(name, price){

    // fazendo um filtro
    const existingItem = cart.find(item => item.name === name)

    // se existir so aumentar a quantidade
    if(existingItem){
        existingItem.quantity += 1;
        return;
    }
    
    // adicionado ao carrinho 
    // mais ele nao esta inteligente ainda
    else{
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }
    updateCartModal();
}


// Atualiza carinho 
function updateCartModal(){

    // zeramos a lista
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {

        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium"> Name: ${item.name}</p>
                    <p> Quantity: ${item.quantity}</p>
                    <p class="font-medium mt-2">${item.price.toFixed(2)} €</p>

                </div> 

                <div>
                    <button class="remove-from-cart-btn" data-name="${item.name}">
                        Remover
                    </button>
                </div> 
            </div>
        `

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement);

    })

    // 
    cartTotal.textContent = total.toLocaleString("pt-PT", {
        style: "currency",
        currency: "EUR"
    });

    cartCounter.innerHTML = cart.length

}


// Função para remover item do carrinho 

cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }

})


function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1){
        const item = cart[index];

        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }
        // remove o obj da lista
        cart.splice(index, 1);
        updateCartModal();
        
    }

}

// pegando o valor do input
addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500") // 1.0.1 remove o classe linha 180
        addresWarn.classList.add("hidden") // volta ao estado inicial
    }

})

// botao de finalizar pedido
checkoutBtn.addEventListener("click", function(event){
    // validações 

    const isOpen = checkRestaurantOpen();
    if (!isOpen) {

        Toastify({
            text: "RESTAURANTE FECHADO NO MOMENTO!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "red",
            },
            onClick: function(){} // Callback after click
          }).showToast();
        
        return;
    }

    if(cart.length === 0) return; // para carinho vazio nao fazer nada
    if(addressInput.value === ""){
        addresWarn.classList.remove("hidden")  // 1.0 remove a classe oculta deixando visivel
        addressInput.classList.add("border-red-500") // campo do input ficara vermelho
        return;
    }

    // enviar o pedido para API whats
    const cartItems = cart.map((item) => {
        return (
            ` ${item.name} Quantidade: (${item.quantity}) Preço: €${item.price} <br>`
        )

    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "351913816383"

    window.open(`https://wa.me/${phone}?text=${message} Mesa: ${addressInput.value}`, "_blank")

    cart = []

    updateCartModal()
   
})

// verificando se esta aberto ou nao 
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 8 && hora < 22; // retorna true, restaurante está aberto
    
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
} else {
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");

}