document.addEventListener("DOMContentLoaded", () => {
    // Dummy invoice data — in real use, fetch from localStorage, server, or passed from another page
    const invoiceData = JSON.parse(localStorage.getItem("invoiceData")) || {
      invoiceNumber: "INV" + Date.now(),
      date: new Date().toISOString().split("T")[0],
      customerName: "John Doe",
      customerContact: "+91-9876543210",
      products: [
        { name: "Laptop", price: 50000, quantity: 1 },
        { name: "T-Shirt", price: 500, quantity: 3 },
        { name: "Cookies", price: 100, quantity: 5 }
      ]
    };
  
    // Fill in header and customer info
    document.getElementById("invoiceNumber").textContent = invoiceData.invoiceNumber;
    document.getElementById("invoiceDate").textContent = invoiceData.date;
    document.getElementById("customerName").textContent = invoiceData.customerName;
    document.getElementById("customerContact").textContent = invoiceData.customerContact;
  
    // Fill in product table
    const tableBody = document.getElementById("invoiceTableBody");
    let subtotal = 0;
  
    invoiceData.products.forEach((product, index) => {
      const total = product.price * product.quantity;
      subtotal += total;
  
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="border p-2 text-center">${index + 1}</td>
        <td class="border p-2">${product.name}</td>
        <td class="border p-2 text-right">₹${product.price.toFixed(2)}</td>
        <td class="border p-2 text-center">${product.quantity}</td>
        <td class="border p-2 text-right">₹${total.toFixed(2)}</td>
      `;
      tableBody.appendChild(row);
    });
  
    // Set totals
    document.getElementById("subtotal").textContent = subtotal.toFixed(2);
    document.getElementById("grandTotal").textContent = subtotal.toFixed(2);
  });
  