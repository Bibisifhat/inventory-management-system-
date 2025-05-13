// Dummy local data instead of API
const vendors = [
    { vendorId: "V001", name: "Vendor One", email: "one@example.com", gstId: "GST1234567" },
    { vendorId: "V002", name: "Vendor Two", email: "two@example.com", gstId: "GST7654321" }
  ];
  
  const products = [
    { product_id: "P001", name: "Product A", price: 100, gst: 5 },
    { product_id: "P002", name: "Product B", price: 200, gst: 12 },
    { product_id: "P003", name: "Product C", price: 300, gst: 18 }
  ];
  
  window.onload = () => {
    try {
      // Populate vendors
      vendors.forEach(v => {
        document.getElementById('vendor').innerHTML += `<option value="${v.vendorId}">${v.name}</option>`;
      });
  
      // Add one item row by default
      addItemRow();
    } catch (err) {
      alert("Failed to load vendors or products.");
      console.error(err);
    }
  };
  
  document.getElementById('vendor').addEventListener('change', function () {
    const v = vendors.find(v => v.vendorId === this.value);
    document.getElementById('vendor-details').innerHTML =
      v ? `GST ID: ${v.gstId || 'N/A'}<br>Email: ${v.email || 'N/A'}` : '';
  });
  
  function addItemRow() {
    const row = document.createElement('tr');
    row.className = 'border';
  
    row.innerHTML = `
      <td class="p-2 border">
        <select class="product-select w-full p-1 border rounded" required>
          <option value="">-- Select --</option>
          ${products.map(p => `<option value="${p.product_id}">${p.product_id}</option>`).join('')}
        </select>
      </td>
      <td class="pname p-2 border">-</td>
      <td class="p-2 border"><input type="number" class="qty w-16 p-1 border rounded" min="1" value="1" required></td>
      <td class="rate p-2 border">0</td>
      <td class="gst p-2 border">0</td>
      <td class="amount p-2 border">0</td>
      <td class="p-2 border text-center">
        <button type="button" onclick="this.closest('tr').remove(); calcTotals();" class="text-red-600">🗑️</button>
      </td>
    `;
  
    document.querySelector('#items-table tbody').appendChild(row);
    row.querySelector('.product-select').addEventListener('change', e => updateProductDetails(e.target));
    row.querySelector('.qty').addEventListener('input', calcTotals);
  }
  
  function updateProductDetails(select) {
    const row = select.closest('tr');
    const prod = products.find(p => p.product_id === select.value);
    if (prod) {
      row.querySelector('.pname').innerText = prod.name;
      row.querySelector('.rate').innerText = prod.price;
      row.querySelector('.gst').innerText = prod.gst;
      calcTotals();
    }
  }
  
  function calcTotals() {
    let subtotal = 0, gstTotal = 0;
    document.querySelectorAll('#items-table tbody tr').forEach(row => {
      const qty = parseFloat(row.querySelector('.qty').value || 0);
      const rate = parseFloat(row.querySelector('.rate').innerText || 0);
      const gst = parseFloat(row.querySelector('.gst').innerText || 0);
      const amt = rate * qty;
      const gstAmt = amt * gst / 100;
      row.querySelector('.amount').innerText = (amt + gstAmt).toFixed(2);
      subtotal += amt;
      gstTotal += gstAmt;
    });
  
    document.getElementById('subtotal').innerText = subtotal.toFixed(2);
    document.getElementById('gst-total').innerText = gstTotal.toFixed(2);
    document.getElementById('total').innerText = (subtotal + gstTotal).toFixed(2);
  }
  
  document.getElementById('invoice-form').addEventListener('submit', e => {
    e.preventDefault();
    alert('Invoice submitted successfully (local demo only).');
  });
  