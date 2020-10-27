let cart = JSON.parse(localStorage.getItem('cart')) || [];
let output = document.getElementById('cart');
let totalPrice = 0;

console.log(cart);

if (cart.length > 0) {
    let cartHtmlTemplate = '<div class="cart__container">';

    for (let product of cart) {
        let colors = '';

        totalPrice += (product.price * product.quantity);

        console.log(product);

        for (let option of product.color) {
                colors += option + ' ';
        }

        cartHtmlTemplate += `
            <div class="cart__row" data-id="${product.id}">
                <div class="cart__row__left">
                    <img src="${product.imageURL}" alt="">
                </div>
                <div class="cart__row__right">
                    <div class="cart__row__right__specs">
                        <h3>${product.name}</h3>
                        <div class="price-color">
                            <p>${product.price} €</p> 
                            <p>${colors}</p> 
                        </div>
                    </div>
                    <div class="cart__row__right__numbers">
                        <p>quantité : <input type="number" min="1" class="quantity" name="quantité" id="${product.id}" value="${product.quantity}"></p>
                        <button data-id="${product.id}" class="setQuantity button">Modifier</button>
                    </div>
                </div>
                <button class="removeItem"></button>
            </div>   
        `;
    }

    output.innerHTML = cartHtmlTemplate;

} else  {
    output.innerHTML = ` 
        <div class="cart__empty">
            <span class="cart__empty__message">
                Vous n'avez aucun produit dans votre panier.
                Rendez vous sur la page des produits pour commencer votre Shopping
                <a href="../index.html" class="btn">Commencer</a> 
            </span>
        </div> 
    `;
}

function totalCart() {
    let cartPrice = 0;
    let outputCartPrice = document.getElementById('totalPrice');

    cart.forEach( item => {
        cartPrice += (item.price * item.quantity);
    });

    outputCartPrice.innerHTML = cartPrice;
}

totalCart();


// On recupere les boutons qui vont modifier les quantités du panier
let buttonsSetQuantity = document.querySelectorAll('.setQuantity');

// Sur chacun de ces boutons on ajoute un Ecouteur d'evenements pour surveiller les clics sur ces boutons
buttonsSetQuantity.forEach((item, index) => {
    item.addEventListener('click', event => {
        // on récupère les valeurs dont on a besoin :
        // Bouton cliqué
        let butttonClicked = event.target;
        // L'id de l'objet grace a un data-id
        let id = butttonClicked.dataset.id;
        // et la value de l'input
        let inputvalue = document.getElementById(id).value;

        if (inputvalue > 0) {
            // si la valeur que l'on veut set est differente de la value du localStorage on la modifie
            if (cart[index].quantity !== inputvalue) {
                // on change la valeur en question et on indique que le panier a ete modifié
                cart[index].quantity = inputvalue;
                localStorage.setItem('cart', JSON.stringify(cart));
                console.log('panier modifié');
                totalCart();
            } else {
                console.log('la valeur ne change pas donc on ne modifie pas le panier');
            }
            //    on prevent de pouvoir envoyé un 0 au cas ou
        } else {
            alert('la valeur doit etre superieur a 0');
        }
    })
});

// On recupere les boutons qui vont permettre de supprimer
let buttonsRemoveItem = document.querySelectorAll('button.removeItem');

// Ajout de l'ecouteur d'evenements sur tous les boutons
buttonsRemoveItem.forEach((item, index) => {
    item.addEventListener('click', event => {
        // le bouton cliqué
        let thisButton = event.target;
        // son parent c'est a dire la row qui contient tout
        let thisrow = thisButton.parentNode;
        // l'id du produit
        let thisid = thisrow.dataset.id;

        // on cherche la correspondance d'id (obligatoire car si le bouton est cliqué c'est qu'il ya forcement ce produit dans le panier)
        if (cart[index].id === thisid) {
            // quand on a une correspondance on supprime le bon item du tableau cart grace a l'index de la boucle
            cart.splice(index, 1);
            // on supprime la row avec la data qui n'existe plus
            localStorage.setItem('cart', JSON.stringify(cart));
            console.log('panier modifié');
            totalCart();
            thisrow.remove();
        }
    })
});

// On recupere le node du Form
let form = document.getElementById('form-order');

//ajout d'evenment submit
form.addEventListener('submit', event => {
    // on empeche le comportement par default du formulaie
    event.preventDefault();

    //on construit l'object contact a envoyer a l'API
    let contact = {
        firstName: document.getElementById('prenom').value,
        lastName: document.getElementById('nom').value,
        address: document.getElementById('adresse').value,
        city: document.getElementById('ville').value,
        email: document.getElementById('mail').value
    };

    console.log(contact);

    // tableaux pour les ids à envoyer a l'API
    let products = [];

    // pour chaque item
    cart.forEach( item => {
       for (let i = 0; i < item.quantity; i++) {
           // on push autant d'ids que de quantity du produit en question
           products.push(item.id);
       }
    });

    // pour la requete API on prepare le header / method etc
    // on place l'objet contact et products pour valider la commande
    let myInit = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
        body : JSON.stringify(
            {
                contact: contact,
                products: products
            }
        )
    };

    getPrice = document.getElementById('totalPrice').textContent;

    // on fetch avec une promesse la requete avec nos parametres precedemment déclarés
    fetch('http://localhost:3000/api/teddies/order', myInit)
        .then(function (response) {
            if (response.ok) {
                localStorage.setItem('contact', JSON.stringify(contact));
                localStorage.setItem('totalPrice', JSON.stringify(getPrice));

                window.location.href = "./command.html";
            } else {
                alert('Nous avons rencontré un problème durant l\'envoie de votre commande veuillez réessayer')
            }
        })
});
