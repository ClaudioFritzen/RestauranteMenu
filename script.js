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
                    <button> Remover </button>
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