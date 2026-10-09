const API_URL = "https://jsonplaceholder.typicode.com/posts";

const list = document.getElementById("product-list");
const form = document.getElementById("product-form");
const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const statusEl = document.getElementById("status");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");

let editingId = null;

//helper
function setStatus(msg, type = "") {
  statusEl.textContent = msg;
  statusEl.className = type;
}

function renderProducts(products) {
  list.innerHTML = "";
  if (!products.length) {
    list.innerHTML = "<li>Nu există produse.</li>";
    return;
  }
  products.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>#${p.id} — ${p.title} (${p.body})</span>
      <button class="edit-btn" data-id="${p.id}" data-title="${p.title}" data-price="${p.body}">Editează</button>
      <button class="delete-btn" data-id="${p.id}">Șterge</button>
    `;
    list.appendChild(li);
  });
}

// ---------- READ ----------
async function loadProducts() {
  setStatus("Se încarcă...");
  try {
    const res = await fetch(`${API_URL}?_limit=10`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    renderProducts(data);
    setStatus(`Încărcate ${data.length} produse.`, "success");
  } catch (err) {
    setStatus("Eroare la încărcare: " + err.message, "error");
    console.error(err);
  }
}

//create / update
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = nameInput.value.trim();
  const body = priceInput.value.trim();

  if (!title || !body) return;

  submitBtn.disabled = true;

  try {
    if (editingId) {
      // UPDATE
      setStatus("Se actualizează...");
      const res = await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, title, body, userId: 1 })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const updated = await res.json();

      // Actualizăm în DOM
      const li = list.querySelector(`.edit-btn[data-id="${editingId}"]`)?.parentElement;
      if (li) {
        li.querySelector("span").textContent = `#${updated.id} — ${updated.title} (${updated.body})`;
        const editBtn = li.querySelector(".edit-btn");
        editBtn.dataset.title = updated.title;
        editBtn.dataset.price = updated.body;
      }

      setStatus("Produs actualizat.", "success");
      resetForm();
    } else {
      // CREATE
      setStatus("Se adaugă...");
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, userId: 1 })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const created = await res.json();

      // Adăugăm în DOM (JSONPlaceholder nu persistă)
      const li = document.createElement("li");
      li.innerHTML = `
        <span>#${created.id} — ${created.title} (${created.body})</span>
        <button class="edit-btn" data-id="${created.id}" data-title="${created.title}" data-price="${created.body}">Editează</button>
        <button class="delete-btn" data-id="${created.id}">Șterge</button>
      `;
      list.appendChild(li);

      setStatus("Produs adăugat.", "success");
      form.reset();
    }
  } catch (err) {
    setStatus("Eroare: " + err.message, "error");
    console.error(err);
  } finally {
    submitBtn.disabled = false;
  }
});

// delete + edit
list.addEventListener("click", async (e) => {
  const target = e.target;

  if (target.classList.contains("delete-btn")) {
    const id = target.dataset.id;
    if (!confirm(`Ștergi produsul #${id}?`)) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      target.parentElement.remove();
      setStatus("Produs șters.", "success");
    } catch (err) {
      setStatus("Eroare la ștergere: " + err.message, "error");
    }
  }

  if (target.classList.contains("edit-btn")) {
    editingId = target.dataset.id;
    nameInput.value = target.dataset.title;
    priceInput.value = target.dataset.price;
    submitBtn.textContent = "Salvează";
    cancelBtn.style.display = "inline-block";
    setStatus(`Editezi produsul #${editingId}...`);
    nameInput.focus();
  }
});

//cancel
cancelBtn.addEventListener("click", resetForm);

function resetForm() {
  editingId = null;
  form.reset();
  submitBtn.textContent = "Adaugă";
  cancelBtn.style.display = "none";
  setStatus("");
}

// start
loadProducts();