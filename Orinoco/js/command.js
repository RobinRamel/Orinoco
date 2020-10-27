let whoOutput = document.getElementById('who');
let priceOutput = document.getElementById('price');
let addressOutput = document.getElementById('address');
let mailOutput = document.getElementById('mail');

 contact = JSON.parse(localStorage.getItem('contact'));
 price = JSON.parse(localStorage.getItem('totalPrice'));

 whoOutput.innerHTML = `
    ${contact.firstName} ${contact.lastName} 
 `;

 priceOutput.innerHTML = `
    ${price}
 `;

 addressOutput.innerHTML = `
    ${contact.address} <br>
    ${contact.city}
 `;

 mailOutput.innerHTML = `
    ${contact.email}
 `;

