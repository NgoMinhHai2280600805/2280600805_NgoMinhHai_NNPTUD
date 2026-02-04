const API_URL = "https://api.escuelajs.co/api/v1/products";

let products = [];
let filteredProducts = [];
let currentPage = 1;
let pageSize = 5;
let currentSort = { field: null, asc: true };

async function fetchProducts() {
  const res = await fetch(API_URL);
  products = await res.json();
  filteredProducts = [...products];
  renderTable();
  renderPagination();
}

function enableTooltips() {
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  tooltipTriggerList.forEach(el => new bootstrap.Tooltip(el));
}

function renderTable() {
  const table = document.getElementById("productTable");
  table.innerHTML = "";

  const start = (currentPage - 1) * pageSize;
  const pageData = filteredProducts.slice(start, start + pageSize);

  pageData.forEach(p => {
    const row = `
      <tr data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="${p.description}" onclick="showDetail(${p.id})" style="cursor:pointer">
        <td>${p.id}</td>
        <td>${p.title}</td>
        <td>$${p.price}</td>
        <td>${p.category?.name || ''}</td>
        <td><img src="${p.images[0]}" width="50"></td>
      </tr>`;
    table.innerHTML += row;
  });

  enableTooltips(); // kích hoạt tooltip
}

function renderPagination() {
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const pag = document.getElementById("pagination");
  pag.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    pag.innerHTML += `<li class="page-item ${i===currentPage?'active':''}">
      <a class="page-link" href="#" onclick="currentPage=${i};renderTable();">${i}</a>
    </li>`;
  }
}

document.getElementById("searchInput").addEventListener("input", e => {
  const val = e.target.value.toLowerCase();
  filteredProducts = products.filter(p => p.title.toLowerCase().includes(val));
  currentPage = 1;
  renderTable();
  renderPagination();
});

document.getElementById("pageSize").addEventListener("change", e => {
  pageSize = parseInt(e.target.value);
  currentPage = 1;
  renderTable();
  renderPagination();
});

function sortData(field) {
  currentSort.asc = currentSort.field === field ? !currentSort.asc : true;
  currentSort.field = field;

  filteredProducts.sort((a,b)=>{
    if(a[field] < b[field]) return currentSort.asc?-1:1;
    if(a[field] > b[field]) return currentSort.asc?1:-1;
    return 0;
  });

  renderTable();
}

function exportCSV() {
  let csv = "id,title,price,category\n";
  const start = (currentPage - 1) * pageSize;
  const pageData = filteredProducts.slice(start, start + pageSize);

  pageData.forEach(p => {
    csv += `${p.id},${p.title},${p.price},${p.category?.name}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "products.csv";
  a.click();
}

function showDetail(id) {
  const p = products.find(x=>x.id===id);
  document.getElementById("modalBody").innerHTML = `
    <input id="editTitle" class="form-control mb-2" value="${p.title}">
    <input id="editPrice" type="number" class="form-control mb-2" value="${p.price}">
    <img src="${p.images[0]}" class="img-fluid">
    <input type="hidden" id="editId" value="${p.id}">
  `;
  new bootstrap.Modal(document.getElementById('detailModal')).show();
}

async function updateProduct() {
  const id = document.getElementById("editId").value;
  const title = document.getElementById("editTitle").value;
  const price = document.getElementById("editPrice").value;

  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, price })
  });

  fetchProducts();
}

async function createProduct() {
  const title = document.getElementById("newTitle").value;
  const price = document.getElementById("newPrice").value;
  const image = document.getElementById("newImage").value;

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title,
      price: parseInt(price),
      description: "New product",
      categoryId: 1,
      images: [image]
    })
  });

  fetchProducts();
}

fetchProducts();
