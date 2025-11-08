const socket = io();

socket.on("updateProducts", (products) => {
  const list = document.getElementById("product-list");
  list.innerHTML = "";

  products.forEach((p) => {
    list.innerHTML += `
      <div class="product-card">
        <img src="${p.thumbnail || ''}" alt="${p.title}">
        <h3>${p.title}</h3>
        <p class="price">$ ${p.price}</p>
        <button onclick="deleteProduct('${p.id}')">Eliminar</button>
      </div>
    `;
  });
});

function deleteProduct(id) {
  socket.emit("deleteProductFromClient", id);
}
