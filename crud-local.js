let products = [
  { id: 1, name: "Laptop", price: 15000 },
  { id: 2, name: "Mouse", price: 300 }
];

products.push({ id: 3, name: "Keyboard", price: 450 });
console.log("După CREATE:", products);

console.log("\n--- Lista produse ---");
products.forEach(p => {
  console.log(`#${p.id} ${p.name} - ${p.price} MDL`);
});

const produs = products.find(p => p.id === 2);
if (produs) produs.price = 350;
console.log("\nDupă UPDATE:", products);

products = products.filter(p => p.id !== 1);
console.log("\nDupă DELETE:", products);