document.addEventListener("DOMContentLoaded", function () {
    // Initial inventory array (can start empty if desired)
    let products = [
     
    ];

    // Function to update the table based on the current products array
    function updateTable() {
        let tableBody = document.getElementById("productTableBody");
        tableBody.innerHTML = "";  // Clear previous content
        
        products.forEach((product, index) => {
            let row = `
                <tr class="border">
                    <td class="border p-2" align="center">${index + 1}</td>
                    <td class="border p-2" align="center">${product.category}</td>
                    <td class="border p-2" align="center">${product.name}</td>
                    <td class="border p-2" align="center">${product.price}</td>
                    <td class="border p-2" align="center">${product.quantity}</td>
                    <td class="border p-2" align="center">${product.price * product.quantity}</td>
                    <td class="border p-2" align="center">
                        <button class="bg-yellow-500 text-white px-3 py-1 rounded" onclick="editProduct(${index})">Edit</button>
                    </td>
                    <td class="border p-2" align="center">
                        <button class="bg-red-500 text-white px-3 py-1 rounded" onclick="deleteProduct(${index})">Delete</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    }

    // Make editProduct and deleteProduct accessible globally
    window.editProduct = function (index) {
        // You can replace these prompts with a form if needed
        let newCategory = prompt("Enter new category:", products[index].category);
        if (newCategory) {
            products[index].category = newCategory;
        }

        let newName = prompt("Enter new product name:", products[index].name);
        if (newName) {
            products[index].name = newName;
        }
        let newPrice = prompt("Enter new price:", products[index].price);
        if (newPrice) {
            products[index].price = Number(newPrice);
        }
        let newQuantity = prompt("Enter new quantity:", products[index].quantity);
        if (newQuantity) {
            products[index].quantity = Number(newQuantity);
        }
        updateTable();
    };

    window.deleteProduct = function(index) {
        if (confirm("Are you sure you want to delete this product?")) {
            products.splice(index, 1);
            updateTable();
        }
    };

    // Event listener for the "Add Product" button using form inputs
    document.getElementById("addProductBtn").addEventListener("click", function () {
        let category = document.getElementById("categorySelect").value;
        let name = document.getElementById("productNameInput").value;
        let price = document.getElementById("productPriceInput").value;
        let quantity = document.getElementById("productQuantityInput").value;
        
        if (category && name && price && quantity) {
            products.push({
                id: products.length + 1,
                category: category,
                name: name,
                price: Number(price),
                quantity: Number(quantity)
            });
            updateTable();
            // Clear the input fields
            document.getElementById("categorySelect").value = "";
            document.getElementById("productNameInput").value = "";
            document.getElementById("productPriceInput").value = "";
            document.getElementById("productQuantityInput").value = "";
        } else {
            alert("Please enter category, product name, price, and quantity.");
        }
    });

    // Initial table update
    updateTable();
});
