const API_URL = "https://jsonplaceholder.typicode.com/posts";
const list = document.getElementById("product-list");
const form = document.getElementById("product-form");

//read
async function loadProducts() {
  try {
    const res = await fetch(API_URL);
    const products = await res.json();
    renderProducts(products.slice(0, 10)); // primele 10
  } catch (err) {
    console.error("Eroare:", err);
  }
}

function renderProducts(products) {
  list.innerHTML = "";
  products.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${p.title} — ${p.id}</span>
      <button data-id="${p.id}" class="delete">Șterge</button>
    `;
    list.appendChild(li);
  });
}

//create
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("name").value;
  const body = document.getElementById("price").value;

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, body, userId: 1 })
  });
  const newProduct = await res.json();
  console.log("Creat:", newProduct);


  const li = document.createElement("li");
  li.innerHTML = `<span>${newProduct.title} — ${newProduct.id}</span>`;
  list.appendChild(li);

  form.reset();
});

//delete
list.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("delete")) return;
  const id = e.target.dataset.id;

  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  e.target.parentElement.remove();
});

loadProducts();