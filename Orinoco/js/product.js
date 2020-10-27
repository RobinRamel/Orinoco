
let urlParams = new URLSearchParams(window.location.search);
let id = urlParams.get('id');
let dataFetched = false;

fetch('http://localhost:3000/api/teddies/' + id)
    .then(response => response.json())
    .then(data => {

        dataFetched = data;
        let options = '';

        for (let option of data.colors) {
            options += `
                            <li>
                                <input class="inputOptions" type="radio" id="${option}" name="teddyColor">
                                <label for="${option}">${option}</label>
                                
                                <div class="check"><div class="inside"></div></div>
                            </li>
                       `;
        }

        output = document.getElementById('product');
        htmlInsert = `
            
            <div class="product__teddy">
                <div class="product__teddy__left">
                    <div class="product__teddy__img">
                        <img id="teddyImage" src="${data.imageUrl}" alt="image de l'ours">
                    </div>
                </div>  
                <div class="product__teddy__right">
                    <div class="product__teddy__title">
                        <h2 id="teddyName">${data.name}</h2>
                    </div>  
                    <div class="product__teddy__excerpt">
                        <p>${data.description}</p>
                    </div>
                    <div class="product__teddy__options">
                        <ul id="options">
                          ${options}
                        </ul>
                    </div>
                    <div class="product__teddy__price">
                        <span> ${data.price} €</span>
                    </div>
                    <div class="product__teddy__add">
                        <label for="quantity">Quantité :</label>
                        <div class="product__teddy__row">
                            <input type="number" min="1" id="quantity" name="quantité">
                            <button id="addToCart">Ajouter</button>
                        </div>
                    </div>
                </div> 
            </div>  
        `;

        output.innerHTML = htmlInsert;

        let button = document.getElementById('addToCart');

        button.addEventListener('click', addCurrentProductToCart);

    });

// Récupérer l'element coché
function  getCheckedELement() {
    //On récupère tous les inputs
    let getAllInputs = document.getElementById('options').getElementsByClassName('inputOptions');
    let valOfInputChecked = '';

    //On parcoure les inputs
    for (let input of getAllInputs) {
        // si on en trouve un coché
        if(input.checked) {
            valOfInputChecked = input.id;
        }
    }
    // on return la value de l'input coché
    return valOfInputChecked;
}

function addCurrentProductToCart() {
    let teddyValue = document.getElementById('quantity').value;
    let teddyQuantity = Number(teddyValue);
    // Le panier dans le local storage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    //Si la valeur de l'input est bien un integer et sup. à 0
    if (Number.isInteger(teddyQuantity) && teddyQuantity !== 0) {
        // On récupère l'option cochée
        let optionChecked = getCheckedELement();

        //Produit à ajouter, construit en partie avec les données de l'api sauf quantité et couleur
        let teddyToAdd = {
            id: dataFetched._id,
            name: dataFetched.name,
            price: dataFetched.price,
            imageURL: dataFetched.imageUrl,
            quantity: teddyQuantity,
            color: [optionChecked]
        };

        // Variable pour savoir si on incrémente seulement une quantité ou ajout d'un nouveau produit
        let cartModified = false;

        // On vérifie si on trouve l'id et si oui on incrément les quantités
        cart.forEach((product) => {
            if (product.id === teddyToAdd.id) {
                product.quantity += teddyToAdd.quantity;
                // si l'option ajoutées n'existe pas dans notre panier on l'ajoute
                if (product.color.includes(optionChecked) === false) {
                    product.color.push(optionChecked);
                }
                cartModified = true;
            }
        });

        // Si aucun ID ne correspond on push le nouvel objet dans le tableau
        if (!cartModified) {
            cart.push(teddyToAdd);
        }

        localStorage.setItem('cart', JSON.stringify(cart));

        alert('successfully added');

    } else {
        alert("Field number must be only Numbers or more than 0");
    }
}