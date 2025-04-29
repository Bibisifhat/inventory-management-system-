let vendorList = [];
let editIndex = -1;

function addVendor() {
  const id = document.getElementById("vendor-id").value.trim();
  const name = document.getElementById("vendor-name").value.trim();
  const email = document.getElementById("vendor-email").value.trim();
  const contact = document.getElementById("vendor-contact").value.trim();
  const gst = document.getElementById("vendor-gst").value.trim();

  if (!id || !name || !email || !contact || !gst) {
    alert("Please fill in all fields");
    return;
  }

  const vendor = { id, name, email, contact, gst };

  if (editIndex === -1) {
    vendorList.push(vendor);
  } else {
    vendorList[editIndex] = vendor;
    editIndex = -1;
  }

  renderVendors();
  clearInputs();
}

function renderVendors() {
  const tbody = document.getElementById("vendor-table-body");
  tbody.innerHTML = "";

  vendorList.forEach((vendor, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="p-2 border" align="center">${vendor.id}</td>
      <td class="p-2 border" align="center">${vendor.name}</td>
      <td class="p-2 border" align="center">${vendor.email}</td>
      <td class="p-2 border" align="center">${vendor.contact}</td>
      <td class="p-2 border" align="center">${vendor.gst}</td>
      <td class="p-2 border space-x-2" align="center">
        <button onclick="editVendor(${index})" class="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500 ">Edit</button>
        <button onclick="removeVendor(${index})" class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Remove</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function removeVendor(index) {
  vendorList.splice(index, 1);
  renderVendors();
}

function editVendor(index) {
  const vendor = vendorList[index];
  document.getElementById("vendor-id").value = vendor.id;
  document.getElementById("vendor-name").value = vendor.name;
  document.getElementById("vendor-email").value = vendor.email;
  document.getElementById("vendor-contact").value = vendor.contact;
  document.getElementById("vendor-gst").value = vendor.gst;
  editIndex = index;
}

function clearInputs() {
  document.getElementById("vendor-id").value = "";
  document.getElementById("vendor-name").value = "";
  document.getElementById("vendor-email").value = "";
  document.getElementById("vendor-contact").value = "";
  document.getElementById("vendor-gst").value = "";
}
