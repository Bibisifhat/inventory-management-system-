

let products = [];

function updateDashboard() {
  const totalProducts = products.length;
  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
  const totalValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

  document.getElementById("totalProducts").innerText = totalProducts;
  document.getElementById("totalQuantity").innerText = totalQuantity;
  document.getElementById("inventoryValue").innerText = `₹${totalValue.toFixed(2)}`;

  updateCategoryBreakdown();
  updateProductTable();
}

function updateCategoryBreakdown() {
  const categoryMap = {};
  products.forEach(p => {
    categoryMap[p.category] = (categoryMap[p.category] || 0) + p.quantity;
  });

  const list = document.getElementById("categoryBreakdown");
  list.innerHTML = "";
  for (const category in categoryMap) {
    const li = document.createElement("li");
    li.textContent = `${category}: ${categoryMap[category]} items`;
    list.appendChild(li);
  }
}

function updateProductTable() {
  const table = document.getElementById("productTableBody");
  table.innerHTML = "";
  products.forEach((p, index) => {
    const row = `
      <tr class="text-center border">
        <td class="border p-2">${p.category}</td>
        <td class="border p-2">${p.name}</td>
        <td class="border p-2">₹${p.price}</td>
        <td class="border p-2">${p.quantity}</td>
        <td class="border p-2">₹${(p.price * p.quantity).toFixed(2)}</td>
        <td class="border p-2">
          <button class="bg-yellow-500 text-white px-3 py-1 rounded" onclick="editProduct(${index})">Edit</button>
        </td>
        <td class="border p-2">
          <button class="bg-red-500 text-white px-3 py-1 rounded" onclick="removeProduct(${index})">Remove</button>
        </td>
      </tr>
    `;
    table.innerHTML += row;
  });
}

function addProduct() {
  const category = document.getElementById("category").value;
  const name = document.getElementById("name").value.trim();
  const price = parseFloat(document.getElementById("price").value);
  const quantity = parseInt(document.getElementById("quantity").value);

  if (!category || !name || isNaN(price) || isNaN(quantity)) {
    alert("Please fill all fields correctly.");
    return;
  }

  products.push({ category, name, price, quantity });

  clearForm();
  updateDashboard();
}

function editProduct(index) {
  const product = products[index];

  // Prefill form
  document.getElementById("category").value = product.category;
  document.getElementById("name").value = product.name;
  document.getElementById("price").value = product.price;
  document.getElementById("quantity").value = product.quantity;

  // Remove product to allow re-add after edit
  products.splice(index, 1);

  updateDashboard();
}

function removeProduct(index) {
  if (confirm("Are you sure you want to remove this product?")) {
    products.splice(index, 1);
    updateDashboard();
  }
}

function clearForm() {
  document.getElementById("category").value = "";
  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
  document.getElementById("quantity").value = "";
}

document.addEventListener("DOMContentLoaded", updateDashboard);


  