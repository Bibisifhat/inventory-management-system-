let invoiceCount = parseInt(localStorage.getItem("invoiceNumber") || "1");

function addItem() {
  const table = document.getElementById("itemRows");
  const row = table.insertRow();

  row.innerHTML = `
    <td>${table.rows.length}</td>
    <td><input type="text" class="input desc" required></td>
    <td><input type="number" class="input qty" value="0" oninput="updateAmounts()"></td>
    <td><input type="number" class="input rate" value="0" oninput="updateAmounts()"></td>
    <td class="amount text-center">0</td>
    <td><button onclick="removeItem(this)" class="text-red-500 font-bold">X</button></td>
  `;
}

function removeItem(btn) {
  const row = btn.parentElement.parentElement;
  row.remove();
  updateAmounts();
}

function updateAmounts() {
  let total = 0;
  document.querySelectorAll("#itemRows tr").forEach((row) => {
    const qty = parseFloat(row.querySelector(".qty").value || 0);
    const rate = parseFloat(row.querySelector(".rate").value || 0);
    const amount = qty * rate;
    row.querySelector(".amount").innerText = amount.toFixed(2);
    total += amount;
  });
}

function numberToWords(num) {
  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  if (num === 0) return "Zero";

  const toWords = (n) => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
    if (n < 1000)
      return a[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " and " + toWords(n % 100) : "");
    if (n < 100000)
      return toWords(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + toWords(n % 1000) : "");
    return n;
  };

  return toWords(num) + " only";
}

function generateInvoice() {
  const data = {
    companyName: document.getElementById("companyName").value,
    companyAddress: document.getElementById("companyAddress").value,
    companyEmail: document.getElementById("companyEmail").value,
    companyContact: document.getElementById("companyContact").value,
    companyGSTIN: document.getElementById("companyGSTIN").value,
    to: document.getElementById("to").value,
    partyGSTIN: document.getElementById("partyGSTIN").value,
    invoiceDate: document.getElementById("invoiceDate").value,
    bankName: document.getElementById("bankName").value,
    accountNumber: document.getElementById("accountNumber").value,
    ifscCode: document.getElementById("ifscCode").value,
    cgst: parseFloat(document.getElementById("cgst").value || "0"),
    sgst: parseFloat(document.getElementById("sgst").value || "0")
  };

  const items = [];
  let total = 0;

  document.querySelectorAll("#itemRows tr").forEach((row) => {
    const desc = row.querySelector(".desc").value;
    const qty = parseFloat(row.querySelector(".qty").value || 0);
    const rate = parseFloat(row.querySelector(".rate").value || 0);
    const amount = qty * rate;
    items.push({ desc, qty, rate, amount });
    total += amount;
  });

  const cgstAmount = total * data.cgst / 100;
  const sgstAmount = total * data.sgst / 100;
  const grandTotal = total + cgstAmount + sgstAmount;
  const amountWords = numberToWords(Math.round(grandTotal));

  document.getElementById("invoiceOutput").classList.remove("hidden");
  document.getElementById("downloadBtn").classList.remove("hidden");

  document.getElementById("invoiceOutput").innerHTML = `
    <div id="invoiceArea">
      <h2 class="text-3xl font-bold text-red-600 text-center">${data.companyName}</h2>
      <p class="text-center">${data.companyAddress}</p>
      <p class="text-center">Email: <a href="mailto:${data.companyEmail}" class="text-blue-500">${data.companyEmail}</a> |
      Contact: ${data.companyContact}</p>
      <p class="text-center">GSTIN: ${data.companyGSTIN}</p>
      <div class="grid grid-cols-2 mt-4 text-sm">
        <div><strong>TO:</strong> ${data.to}<br><strong>Party GSTIN:</strong> ${data.partyGSTIN}</div>
        <div class="text-right"><strong>Tax Invoice No.:</strong> ${String(invoiceCount).padStart(3, "0")}<br><strong>Date:</strong> ${data.invoiceDate}</div>
      </div>
      <table class="w-full border mt-4 invoice-table">
        <thead><tr><th>Sr. no.</th><th>Description</th><th>Qty</th><th>Unit Rate</th><th>Taxable</th></tr></thead>
        <tbody>${items.map((item, i) => `<tr><td>${i + 1}</td><td>${item.desc}</td><td>${item.qty}</td><td>${item.rate}</td><td>${item.amount.toFixed(2)}</td></tr>`).join('')}</tbody>
      </table>
      <div class="grid grid-cols-2 mt-4">
        <div><strong>Amount in Words:</strong> Rupees ${amountWords}</div>
        <div class="text-right">
          <p><strong>Sub Total:</strong> ₹${total.toFixed(2)}</p>
          <p><strong>CGST @${data.cgst}%:</strong> ₹${cgstAmount.toFixed(2)}</p>
          <p><strong>SGST @${data.sgst}%:</strong> ₹${sgstAmount.toFixed(2)}</p>
          <p class="text-lg font-bold">TOTAL: ₹${grandTotal.toFixed(2)}</p>
        </div>
      </div>
      <div class="mt-4"><strong>Bank Details:</strong><br>
        Bank Name: ${data.bankName}<br>
        A/C No: ${data.accountNumber}<br>
        IFSC: ${data.ifscCode}
      </div>
    </div>
  `;

  localStorage.setItem("invoiceNumber", ++invoiceCount);
}

function downloadInvoice() {
  const invoice = document.getElementById("invoiceArea");
  const opt = {
    margin: 0.5,
    filename: `Invoice-${String(invoiceCount - 1).padStart(3, "0")}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
  };
  html2pdf().from(invoice).set(opt).save();
}
