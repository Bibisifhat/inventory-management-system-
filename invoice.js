// invoice.js
document.addEventListener('DOMContentLoaded', () => {
  let invoiceCounter = localStorage.getItem('invoiceCounter') || 1000;

  // Add Item Row
  window.addItemRow = () => {
      const tbody = document.querySelector('#itemsTable tbody');
      const row = document.createElement('tr');
      row.innerHTML = `
          <td><input type="text" class="item-desc p-2 border rounded w-full" required></td>
          <td><input type="number" class="item-qty p-2 border rounded w-full" min="1" required></td>
          <td><input type="number" class="item-price p-2 border rounded w-full" min="0" step="0.01" required></td>
          <td><input type="number" class="item-cgst p-2 border rounded w-full" value="9" required></td>
          <td><input type="number" class="item-sgst p-2 border rounded w-full" value="9" required></td>
          <td class="item-total text-right p-2"></td>
          <td><button class="remove-item bg-red-500 text-white px-2 py-1 rounded">Remove</button></td>
      `;
      tbody.appendChild(row);
  };

  // Calculate Totals
  const calculateTotal = () => {
      let grandTotal = 0;
      document.querySelectorAll('#itemsTable tbody tr').forEach(row => {
          const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
          const price = parseFloat(row.querySelector('.item-price').value) || 0;
          const cgst = parseFloat(row.querySelector('.item-cgst').value) || 0;
          const sgst = parseFloat(row.querySelector('.item-sgst').value) || 0;
          
          const taxable = qty * price;
          const total = taxable + (taxable * (cgst + sgst) / 100);
          row.querySelector('.item-total').textContent = total.toFixed(2);
          grandTotal += total;
      });
      return grandTotal;
  };

  // Updated numberToWords function
const numberToWords = (num) => {
  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const convertLessThanThousand = (n) => {
      let result = '';
      if (n >= 100) {
          result += units[Math.floor(n / 100)] + ' Hundred ';
          n %= 100;
      }
      if (n >= 20) {
          result += tens[Math.floor(n / 10)] + ' ';
          n %= 10;
      }
      if (n >= 10) {
          result += teens[n - 10] + ' ';
          n = 0;
      }
      if (n > 0) {
          result += units[n] + ' ';
      }
      return result.trim();
  };

  const convert = (n) => {
      if (n === 0) return 'Zero';
      let result = '';
      
      if (n >= 100000) {
          result += convertLessThanThousand(Math.floor(n / 100000)) + ' Lakh ';
          n %= 100000;
      }
      if (n >= 1000) {
          result += convertLessThanThousand(Math.floor(n / 1000)) + ' Thousand ';
          n %= 1000;
      }
      if (n > 0) {
          result += convertLessThanThousand(n);
      }
      return result.trim().replace(/\s+/g, ' ');
  };

  const integerPart = Math.floor(num);
  const decimalPart = Math.round((num - integerPart) * 100);
  
  let words = '';
  if (integerPart > 0) {
      words += convert(integerPart) + ' Rupees';
  }
  if (decimalPart > 0) {
      if (words !== '') words += ' and ';
      words += convert(decimalPart) + ' Paise';
  }
  return words + ' Only';
};



// In invoice.js, update the generateInvoice function
window.generateInvoice = () => {
  if(!document.getElementById('invoiceForm').checkValidity()) {
      alert('Please fill all required fields');
      return;
  }

  const totalAmount = calculateTotal();
  const invoiceHTML = `
      <div class="invoice-template">
          <h1 class="text-3xl font-bold text-center mb-4">${document.getElementById('companyName').value}</h1>
          
          <div class="flex justify-between mb-6">
              <div>
                  <h2 class="text-2xl font-bold">TAX INVOICE</h2>
                  <p class="text-blue-600 font-bold">Invoice #${invoiceCounter}</p>
              </div>
              <div>
                  <p>Date: ${document.getElementById('invoiceDate').value}</p>
              </div>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-6">
              <div class="border p-4 rounded">
                  <h3 class="font-bold">Seller Details:</h3>
                  <p>${document.getElementById('address').value}</p>
                  <p>Email: ${document.getElementById('email').value}</p>
                  <p>Contact: ${document.getElementById('contact').value}</p>
                  <p>GSTIN: ${document.getElementById('gstin').value}</p>
              </div>
              <div class="border p-4 rounded">
                  <h3 class="font-bold">Buyer Details:</h3>
                  <p>${document.getElementById('clientName').value}</p>
                  <p>GSTIN: ${document.getElementById('clientGstin').value}</p>
              </div>
          </div>

          <table class="w-full mb-6">
              <thead class="bg-gray-50">
                  <tr>
                      <th class="p-2">Description</th>
                      <th class="p-2">Quantity</th>
                      <th class="p-2">Unit Price</th>
                      <th class="p-2">CGST%</th>
                      <th class="p-2">SGST%</th>
                      <th class="p-2">Amount</th>
                  </tr>
              </thead>
              <tbody>
                  ${Array.from(document.querySelectorAll('#itemsTable tbody tr')).map(row => `
                      <tr>
                          <td class="p-2">${row.querySelector('.item-desc').value}</td>
                          <td class="p-2">${row.querySelector('.item-qty').value}</td>
                          <td class="p-2">₹${row.querySelector('.item-price').value}</td>
                          <td class="p-2">${row.querySelector('.item-cgst').value}%</td>
                          <td class="p-2">${row.querySelector('.item-sgst').value}%</td>
                          <td class="p-2">₹${row.querySelector('.item-total').textContent}</td>
                      </tr>
                  `).join('')}
              </tbody>
          </table>

          <div class="text-right mb-6">
              <h3 class="text-xl font-bold">Total: ₹${totalAmount.toFixed(2)}</h3>
          </div>

          <div class="border-t pt-4">
              <h3 class="font-bold">Bank Details:</h3>
              <p>Bank: ${document.getElementById('bankName').value}</p>
              <p>IFSC: ${document.getElementById('ifsc').value}</p>
              <p>Account: ${document.getElementById('accountNo').value}</p>
          </div>

          <div class="mt-6 p-4 border-t-2 border-b-2">
              <p class="font-semibold">Amount in Words: ${numberToWords(totalAmount)}</p>
          </div>
      </div>
  `;

  const preview = document.getElementById('invoicePreview');
  preview.innerHTML = invoiceHTML;
  preview.classList.remove('hidden');
  document.getElementById('downloadBtn').classList.remove('hidden');
  
  invoiceCounter++;
  localStorage.setItem('invoiceCounter', invoiceCounter);
};

  // PDF Download
 // Update the downloadPDF function
window.downloadPDF = async () => {
  const element = document.querySelector('.invoice-template');
  
  // Temporarily remove Tailwind classes that might cause issues
  element.classList.remove('hidden');
  
  // Create a clone to preserve original styling
  const clone = element.cloneNode(true);
  clone.style.width = '210mm'; // Standard A4 width
  clone.style.margin = '0 auto';
  document.body.appendChild(clone);

  const opt = {
      margin:       10,
      filename:     `invoice-${invoiceCounter}.pdf`,
      image:        { type: 'jpeg', quality: 1 },
      html2canvas:  { 
          scale: 2,
          logging: true,
          useCORS: true,
          scrollY: 0,
          allowTaint: true
      },
      jsPDF:        { 
          unit: 'mm',
          format: 'a4',
          orientation: 'landscape'
      }
  };

  try {
      // Add small delay to ensure rendering
      await new Promise(resolve => setTimeout(resolve, 500));
      await html2pdf().set(opt).from(clone).save();
  } catch (error) {
      console.error('PDF generation failed:', error);
  } finally {
      document.body.removeChild(clone);
  }
};
  // Event Listeners
  document.getElementById('itemsTable').addEventListener('input', calculateTotal);
  document.querySelector('#itemsTable tbody').addEventListener('click', (e) => {
      if(e.target.classList.contains('remove-item')) {
          e.target.closest('tr').remove();
          calculateTotal();
      }
  });

  // Initial row
  addItemRow();
});