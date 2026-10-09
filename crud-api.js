const API_URL = "https://jsonplaceholder.typicode.com/posts";

//read
async function getPosts() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    console.log("READ:", data.slice(0, 3));
  } catch (err) {
    console.error("Eroare READ:", err);
  }
}

//create
async function createPost(post) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    console.log("CREATE:", data);
  } catch (err) {
    console.error("Eroare CREATE:", err);
  }
}

//upgrade
async function updatePost(id, post) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    console.log("UPDATE:", data);
  } catch (err) {
    console.error("Eroare UPDATE:", err);
  }
}

//delete
async function deletePost(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    console.log("DELETE status:", res.status);
  } catch (err) {
    console.error("Eroare DELETE:", err);
  }
}

// Test
(async () => {
  await getPosts();
  await createPost({ title: "Salut", body: "Test", userId: 1 });
  await updatePost(1, { title: "Titlu nou", body: "Conținut nou", userId: 1 });
  await deletePost(1);
})();