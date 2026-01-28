fetch("https://api.escuelajs.co/api/v1/products")
.then(res => res.json())
.then(products => {

    const tableBody = document.querySelector("#productTable tbody");

    products.forEach(product => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${product.id}</td>
            <td>
                <img src="${product.images[0]}" width="60">
            </td>
            <td>${product.title}</td>
            <td>${product.slug}</td>
            <td>$${product.price}</td>
            <td>${product.description.substring(0, 40)}...</td>
            <td>${product.category.name}</td>
        `;

        tableBody.appendChild(row);
    });

})
.catch(err => console.log("Lỗi:", err));

