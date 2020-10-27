fetch('http://localhost:3000/api/teddies')
    .then(response => response.json())
    .then(data =>  {
        let output = document.getElementById("teddies");
        let htmlInsert = '';

        for (let teddy of data) {
            htmlInsert += `<div class="teddy">
                                <a href="product.html?id=${teddy._id}">
                                   <div class="teddy__img"> <img src="  ${teddy.imageUrl}  " alt=""> </div>
                                   <div class="teddy__content">
                                        <div class="teddy__name"> <h3>   ${teddy.name}   </h3> </div>
                                        <div class="teddy__description"> <p>   ${teddy.description}   </p> </div>
                                        <div class="teddy__price"> <span> ${teddy.price} €</span> </div>
                                   </div>
                                </a>
                           </div>
`;
        }

        output.innerHTML = htmlInsert;
    });